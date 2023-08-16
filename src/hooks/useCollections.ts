import { StorageKey, u32 } from '@polkadot/types';
import { AccountId32 } from '@polkadot/types/interfaces';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { saveDataToIpfs } from '@api/pinata.ts';

import { useAccounts } from '@contexts/AccountsContext.tsx';
import { useModalStatus } from '@contexts/ModalStatusContext.tsx';

import { IPFS_GATEWAY } from '@helpers/config.ts';
import { ModalStatusTypes, StatusMessages } from '@helpers/constants.ts';
import { handleError } from '@helpers/handleError.ts';
import {
  CollectionConfig,
  CollectionMetadata,
  CollectionMetadataData,
  CollectionMetadataPrimitive,
} from '@helpers/interfaces.ts';
import { routes } from '@helpers/routes.ts';
import { getCidHash, getCidUrl } from '@helpers/utilities.ts';

export const useCollections = () => {
  const { api, activeAccount, activeWallet } = useAccounts();
  const navigate = useNavigate();
  const { openModalStatus, setStatus, setAction } = useModalStatus();
  const [collectionsMetadata, setCollectionsMetadata] = useState<CollectionMetadata[] | null>(null);
  const [collectionMetadata, setCollectionMetadata] = useState<CollectionMetadata | null>(null);
  const [isCollectionDataLoading, setIsCollectionDataLoading] = useState(false);

  const getCollectionIds = useCallback(async () => {
    if (api && activeAccount) {
      const results: StorageKey<[AccountId32, u32]>[] = await api.query.nfts.collectionAccount.keys(
        activeAccount.address,
      );

      const collectionIds = results
        .map(({ args: [, collectionId] }) => collectionId)
        .sort((a, b) => a.cmp(b))
        .map((collectionId) => collectionId.toString());

      if (collectionIds.length > 0) {
        return collectionIds;
      }
    }

    return null;
  }, [api, activeAccount]);

  const getCollectionsMetadata = useCallback(async () => {
    if (api) {
      setIsCollectionDataLoading(true);

      try {
        let metadata: CollectionMetadata[] = [];

        const ownedCollectionIds = await getCollectionIds();
        if (!ownedCollectionIds) {
          setCollectionsMetadata(metadata);
          return;
        }

        const rawMetadata = await api.query.nfts.collectionMetadataOf.multi(ownedCollectionIds);

        if (Array.isArray(rawMetadata) && rawMetadata.length > 0) {
          const fetchCalls = rawMetadata.map((metadata) => {
            const primitiveMetadata = metadata.toPrimitive() as unknown as CollectionMetadataPrimitive;
            if (!primitiveMetadata?.data) {
              return null;
            }

            return fetch(`${IPFS_GATEWAY}${getCidHash(primitiveMetadata.data)}`);
          });

          const fetchedData = await Promise.all(fetchCalls);
          const parsedData = await Promise.all(fetchedData.map((data) => (data !== null ? data.json() : null)));

          metadata = parsedData.map((data, index) => ({
            id: ownedCollectionIds[index],
            name: data?.name,
            description: data?.description,
            image: getCidHash(data?.image),
          }));
        }

        setCollectionsMetadata(metadata);
      } catch (error) {
        //
      } finally {
        setIsCollectionDataLoading(false);
      }
    }
  }, [api, getCollectionIds]);

  const getCollectionMetadata = useCallback(
    async (collectionId: string) => {
      if (api && collectionId) {
        setIsCollectionDataLoading(true);

        try {
          let metadata: CollectionMetadata | null = null;

          const ownedCollectionIds = await getCollectionIds();
          if (!ownedCollectionIds || !ownedCollectionIds.includes(collectionId)) {
            return;
          }

          const rawMetadata = await api.query.nfts.collectionMetadataOf(collectionId);

          if (rawMetadata) {
            const primitiveMetadata = rawMetadata.toPrimitive() as unknown as CollectionMetadataPrimitive;
            if (!primitiveMetadata?.data) {
              return null;
            }

            const fetchedData = await fetch(`${IPFS_GATEWAY}${getCidHash(primitiveMetadata.data)}`);

            metadata = await fetchedData.json();
            if (metadata?.image) {
              metadata.image = getCidHash(metadata.image);
            }
          }

          setCollectionMetadata(metadata);
        } catch (error) {
          //
        } finally {
          setIsCollectionDataLoading(false);
        }
      } else {
        setCollectionMetadata(null);
      }
    },
    [api, getCollectionIds],
  );

  const saveCollectionMetadata = useCallback(
    async (collectionId: string, collectionMetadata: CollectionMetadataData) => {
      if (api && activeAccount && activeWallet) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          if (collectionMetadata.image) {
            collectionMetadata.image = getCidUrl(collectionMetadata.image);
          }

          const cid = await saveDataToIpfs(collectionMetadata);
          const metadataCid = getCidUrl(cid);

          const unsub = await api.tx.nfts
            .setCollectionMetadata(collectionId, metadataCid)
            .signAndSend(activeAccount.address, { signer: activeWallet.signer }, ({ events, status }) => {
              if (status.isReady) {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.METADATA_UPDATING });
              }

              if (status.isInBlock) {
                unsub();

                events.some(({ event: { method } }) => {
                  if (method === 'ExtrinsicSuccess') {
                    setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.METADATA_UPDATED });
                    setAction(() => () => navigate(routes.myAssets.mintNftMain));

                    return true;
                  }

                  if (method === 'ExtrinsicFailed') {
                    setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.ACTION_FAILED });
                    setAction(() => () => navigate(routes.myAssets.mintNftMain));

                    return true;
                  }

                  return false;
                });
              }
            });
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [api, activeAccount, activeWallet, setStatus, openModalStatus, setAction, navigate],
  );

  const createCollection = useCallback(
    async (collectionConfig: CollectionConfig, collectionMetadata: CollectionMetadataData) => {
      if (api && activeAccount && activeWallet) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          const unsub = await api.tx.nfts
            .create(activeAccount.address, collectionConfig)
            .signAndSend(activeAccount.address, { signer: activeWallet.signer }, ({ events, status }) => {
              if (status.isReady) {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.COLLECTION_CREATING });
              }

              if (status.isInBlock) {
                unsub();
                events.some(({ event: { data, method } }) => {
                  if (method === 'Created') {
                    setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.COLLECTION_CREATED });
                    const mintedCollectionId = data[0].toString();
                    saveCollectionMetadata(mintedCollectionId, collectionMetadata);

                    return true;
                  }

                  if (method === 'ExtrinsicFailed') {
                    setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.ACTION_FAILED });

                    return true;
                  }

                  return false;
                });
              }
            });
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [api, activeAccount, activeWallet, setStatus, openModalStatus, saveCollectionMetadata],
  );

  const getCollectionConfig = useCallback(
    async (collectionId: string) => {
      if (api) {
        const config = await api.query.nfts.collectionConfigOf(collectionId);

        return config;
      }
    },
    [api],
  );

  return {
    getCollectionsMetadata,
    getCollectionMetadata,
    saveCollectionMetadata,
    createCollection,
    collectionsMetadata,
    collectionMetadata,
    isCollectionDataLoading,
    getCollectionConfig,
  };
};
