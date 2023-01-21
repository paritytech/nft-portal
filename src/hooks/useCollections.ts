import { StorageKey, u32 } from '@polkadot/types';
import { AccountId32 } from '@polkadot/types/interfaces';
import { useCallback, useState } from 'react';

import { saveDataToIpfs } from '@api/pinata';

import { useAccounts } from '@contexts/AccountContext';

import { IPFS_URL } from '@helpers/config';
import { CollectionMetadata, CollectionMetadataData } from '@helpers/interfaces';

export const useCollections = () => {
  const { api, activeAccount, activeWallet } = useAccounts();
  const [collectionsMetadata, setCollectionsMetadata] = useState<CollectionMetadata[] | null>(null);
  const [collectionMetadata, setCollectionMetadata] = useState<CollectionMetadata | null>(null);
  const [isCollectionDataLoading, setIsCollectionDataLoading] = useState(false);
  const [isCollectionDataSaving, setIsCollectionDataSaving] = useState(false);

  const getCollectionIds = useCallback(async () => {
    if (api && activeAccount) {
      const results: StorageKey<[AccountId32, u32]>[] = await api.query.nfts.collectionAccount.keys(activeAccount.address);

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
            const primitiveMetadata = metadata.toPrimitive() as any; //TODO can't import proper type PalletUniquesCollectionMetadata;
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
            const primitiveMetadata = rawMetadata.toPrimitive() as any; //TODO can't import proper type PalletUniquesCollectionMetadata;
            if (!primitiveMetadata?.data) {
              return null;
            }

            const fetchedData = await fetch(`${IPFS_URL}${primitiveMetadata.data}`);

            metadata = await fetchedData.json();
          }

          setCollectionMetadata(metadata);
        } catch (error) {
        } finally {
          setIsCollectionDataLoading(false);
        }
      }
    },
    [api, getCollectionIds],
  );

  const mintCollection = useCallback(async () => {
    if (api && activeAccount && activeWallet) {
      setIsCollectionDataSaving(true);

      try {
        const unsub = await api.tx.nfts
          .create(activeAccount.address, null)
          .signAndSend(activeAccount.address, { signer: activeWallet.signer }, ({ status }) => {
            if (status.isFinalized) {
              setIsCollectionDataSaving(false);
              getCollectionsMetadata();
              unsub();
            }
          });
      } catch (error) {
        setIsCollectionDataSaving(false);
      }
    }
  }, [api, activeAccount, activeWallet, getCollectionsMetadata]);

  const saveCollectionMetadata = useCallback(
    async (collectionId: string, collectionMetadata: CollectionMetadataData) => {
      if (api && activeAccount && activeWallet) {
        setIsCollectionDataSaving(true);

        try {
          const metadataCid = await saveDataToIpfs(collectionMetadata);

          await api.tx.nfts.setCollectionMetadata(collectionId, metadataCid).signAndSend(activeAccount.address, { signer: activeWallet.signer });
        } catch (error) {
        } finally {
          setIsCollectionDataSaving(false);
        }
      }
    },
    [api, activeAccount, activeWallet],
  );

  return {
    getCollectionsMetadata,
    getCollectionMetadata,
    saveCollectionMetadata,
    mintCollection,
    collectionsMetadata,
    collectionMetadata,
    isCollectionDataLoading,
    isCollectionDataSaving,
  };
};
