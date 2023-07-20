import { CollectionConfig, FrameSystemEvent, PalletNftsEvent, RuntimeEvent, local } from '@capi/local';
import { StorageKey, u32 } from '@polkadot/types';
import { AccountId32 } from '@polkadot/types/interfaces';
import { SignerError, is } from 'capi';
import { signature } from 'capi/patterns/signature/statemint';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { saveDataToIpfs } from '@api/pinata.ts';

import { useAccounts } from '@contexts/AccountsContext.tsx';
import { useModalStatus } from '@contexts/ModalStatusContext.tsx';

import { IPFS_URL } from '@helpers/config.ts';
import { ModalStatusTypes, StatusMessages } from '@helpers/constants.ts';
import { handleError } from '@helpers/handleError.ts';
import { CollectionMetadata, CollectionMetadataData, CollectionMetadataPrimitive } from '@helpers/interfaces.ts';
import { routes } from '@helpers/routes.ts';
import { toMultiAddress, toUint8Array } from '@helpers/utilities.ts';

export const useCollections = () => {
  const { api, activeAccount, sender } = useAccounts();
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

            return fetch(`${IPFS_URL}${primitiveMetadata.data}`);
          });

          const fetchedData = await Promise.all(fetchCalls);
          const parsedData = await Promise.all(fetchedData.map((data) => (data !== null ? data.json() : null)));

          metadata = parsedData.map((data, index) => ({
            id: ownedCollectionIds[index],
            name: data?.name,
            description: data?.description || null,
            image: data?.image || null,
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

            const fetchedData = await fetch(`${IPFS_URL}${primitiveMetadata.data}`);

            metadata = await fetchedData.json();
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
      if (activeAccount && sender) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          const metadataCid = await saveDataToIpfs(collectionMetadata);

          const sent = local.Nfts.setCollectionMetadata({
            collection: parseInt(collectionId, 10),
            data: toUint8Array(metadataCid),
          })
            .signed(
              signature({
                sender,
              }),
            )
            .sent()
            .dbgStatus('Set collection metadata:');

          sent
            .transactionStatuses((status) => {
              // TODO update to a specific method after merge of https://github.com/paritytech/capi/pull/1176
              if (status === 'ready') {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.METADATA_UPDATING });
              }

              return false;
            })
            .rehandle(is(SignerError), (error) => error.access('inner'))
            .run();

          const inBlockEvents = await sent.inBlockEvents().run();

          inBlockEvents.some(({ event }) => {
            if (RuntimeEvent.isNfts(event) && PalletNftsEvent.isCollectionMetadataSet(event.value)) {
              setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.METADATA_UPDATED });

              setAction(() => () => navigate(routes.myAssets.mintNft(collectionId)));

              return true;
            }

            if (RuntimeEvent.isSystem(event) && FrameSystemEvent.isExtrinsicFailed(event.value)) {
              setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.ACTION_FAILED });

              setAction(() => () => navigate(routes.myAssets.mintNftMain));

              return true;
            }

            return false;
          });
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [activeAccount, setStatus, openModalStatus, setAction, navigate, sender],
  );

  const createCollection = useCallback(
    async (collectionConfig: CollectionConfig, collectionMetadata: CollectionMetadataData) => {
      if (activeAccount && sender) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          const sent = local.Nfts.create({
            config: collectionConfig,
            admin: toMultiAddress(activeAccount.address),
          })
            .signed(
              signature({
                sender,
              }),
            )
            .sent()
            .dbgStatus('Create collection:');

          sent
            .transactionStatuses((status) => {
              // TODO update to a specific method after merge of https://github.com/paritytech/capi/pull/1176
              if (status === 'ready') {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.COLLECTION_CREATING });
              }

              return false;
            })
            .rehandle(is(SignerError), (error) => error.access('inner'))
            .run();

          // TODO change to inBlockEvents after https://github.com/paritytech/capi/issues/1194, https://github.com/paritytech/capi/issues/1134 are fixed
          const inBlockEvents = await sent.finalizedEvents().run();

          inBlockEvents.some(({ event }) => {
            if (RuntimeEvent.isNfts(event) && PalletNftsEvent.isCreated(event.value)) {
              setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.COLLECTION_CREATED });

              const mintedCollectionId = event.value.collection;
              saveCollectionMetadata(mintedCollectionId.toString(), collectionMetadata);

              return true;
            }

            if (RuntimeEvent.isSystem(event) && FrameSystemEvent.isExtrinsicFailed(event.value)) {
              setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.ACTION_FAILED });

              return true;
            }

            return false;
          });
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [activeAccount, setStatus, openModalStatus, saveCollectionMetadata, sender],
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
