import { StorageKey, u32 } from '@polkadot/types';
// import { PalletUniquesCollectionMetadata } from '@polkadot/types/lookup';
import { AccountId32 } from '@polkadot/types/interfaces';
import { useCallback, useEffect, useState } from 'react';

import { IPFS_URL } from '@helpers/config';
import { CollectionMetadata, CollectionMetadataData } from '@helpers/interfaces';
import { useAccounts } from '@contexts/AccountContext';
import { saveToIpfs } from '@api/pinata';

export const useCollections = () => {
  const { api, activeAccount, activeWallet } = useAccounts();
  const [ownedCollectionIds, setOwnedCollectionIds] = useState<string[] | null>(null);
  const [collectionsMetadata, setCollectionsMetadata] = useState<CollectionMetadata[] | null>(null);
  const [collectionMetadata, setCollectionMetadata] = useState<CollectionMetadata | null>(null);
  const [isCollectionDataLoading, setIsCollectionDataLoading] = useState(false);

  const getCollectionIds = useCallback(async () => {
    if (api && activeAccount) {
      const results: StorageKey<[AccountId32, u32]>[] = await api.query.nfts.collectionAccount.keys(activeAccount.address);

      const collectionIds = results
        .map(({ args: [, collectionId] }) => collectionId)
        .sort((a, b) => a.cmp(b))
        .map((collectionId) => collectionId.toString());

      if (collectionIds.length > 0) {
        setOwnedCollectionIds(collectionIds);
      }
    }

    return [];
  }, [api, activeAccount]);

  const getCollectionsMetadata = useCallback(async () => {
    if (api && ownedCollectionIds) {
      setIsCollectionDataLoading(true);

      try {
        let metadata: CollectionMetadata[] = [];
        const rawMetadata = await api.query.nfts.collectionMetadataOf.multi(ownedCollectionIds);

        if (Array.isArray(rawMetadata) && rawMetadata.length > 0) {
          const fetchCalls = rawMetadata.map((metadata) => {
            const primitiveMetadata = metadata.toPrimitive() as any; //TODO can't import proper type PalletUniquesCollectionMetadata;
            if (primitiveMetadata === null) {
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
  }, [api, ownedCollectionIds]);

  const getCollectionMetadata = useCallback(
    async (collectionId: string) => {
      if (api && collectionId && ownedCollectionIds && ownedCollectionIds.includes(collectionId)) {
        setIsCollectionDataLoading(true);

        try {
          let metadata: CollectionMetadata | null = null;
          const rawMetadata = await api.query.nfts.collectionMetadataOf(collectionId);

          if (rawMetadata) {
            const primitiveMetadata = rawMetadata.toPrimitive() as any; //TODO can't import proper type PalletUniquesCollectionMetadata;
            if (primitiveMetadata === null) {
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
    [api, ownedCollectionIds],
  );

  const createNewCollection = useCallback(async () => {
    if (api && activeAccount && activeWallet) {
      setIsCollectionDataLoading(true);

      try {
        await api.tx.nfts.create(activeAccount.address, null).signAndSend(activeAccount.address, { signer: activeWallet.signer });
      } catch (error) {
      } finally {
        setIsCollectionDataLoading(false);
      }
    }
  }, [api, activeAccount, activeWallet]);

  const saveCollectionMetadata = useCallback(
    async (collectionId: string, collectionMetadata: CollectionMetadataData) => {
      if (api && activeAccount && activeWallet) {
        const metadataCid = await saveToIpfs(collectionMetadata);

        await api.tx.nfts.setCollectionMetadata(collectionId, metadataCid).signAndSend(activeAccount.address, { signer: activeWallet.signer });
      }
    },
    [api, activeAccount, activeWallet],
  );

  useEffect(() => {
    getCollectionIds();
  }, [getCollectionIds, api]);

  return {
    getCollectionsMetadata,
    getCollectionMetadata,
    saveCollectionMetadata,
    createNewCollection,
    ownedCollectionIds,
    collectionsMetadata,
    collectionMetadata,
    isCollectionDataLoading,
  };
};
