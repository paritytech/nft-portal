import { StorageKey, u32 } from '@polkadot/types';
import { PalletUniquesCollectionMetadata } from '@polkadot/types/lookup';
import { AccountId32 } from '@polkadot/types/interfaces';
import { useCallback, useEffect, useState } from 'react';

import { CollectionMetadata, CollectionMetadataData } from '../constants';
import { useAccounts } from '../Contexts';
import { saveToIpfs } from '../api';
import { IPFS_URL } from '../helpers';

const useCollectionsMetadata = () => {
  const { api, activeAccount, activeWallet } = useAccounts();
  const [ownedCollectionIds, setOwnedCollectionIds] = useState<string[] | null>(null);
  const [collectionsMetadata, setCollectionsMetadata] = useState<CollectionMetadata[] | null>(null);
  const [collectionMetadata, setCollectionMetadata] = useState<CollectionMetadata | null>(null);

  const getAccountCollectionsIds = useCallback(async () => {
    if (api && activeAccount) {
      const results: StorageKey<[AccountId32, u32]>[] = await api.query.nfts.collectionAccount.keys(activeAccount.address);

      const collectionIds = results
        .map(({ args: [, collectionId] }) => collectionId)
        .sort((a, b) => a.cmp(b))
        .map((collectionId) => collectionId.toString());

      setOwnedCollectionIds(collectionIds);
    }

    return [];
  }, [api, activeAccount]);

  const getCollectionsMetadata = useCallback(async () => {
    if (api && ownedCollectionIds) {
      let metadata: CollectionMetadata[] = [];
      const rawMetadata = await api.query.nfts.collectionMetadataOf.multi(ownedCollectionIds);

      if (Array.isArray(rawMetadata) && rawMetadata.length > 0) {
        const fetchCalls = rawMetadata.map((metadata) => {
          const primitiveMetadata = metadata.toPrimitive() as unknown as PalletUniquesCollectionMetadata;
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
    }
  }, [api, ownedCollectionIds]);

  const getCollectionMetadata = useCallback(
    async (collectionId: string) => {
      if (api && collectionId && ownedCollectionIds && ownedCollectionIds.includes(collectionId)) {
        let metadata: CollectionMetadata | null = null;
        const rawMetadata = await api.query.nfts.collectionMetadataOf(collectionId);

        if (rawMetadata) {
          const primitiveMetadata = rawMetadata.toPrimitive() as unknown as PalletUniquesCollectionMetadata;
          if (primitiveMetadata === null) {
            return null;
          }

          const fetchedData = await fetch(`${IPFS_URL}${primitiveMetadata.data}`);

          metadata = await fetchedData.json();
        }

        setCollectionMetadata(metadata);
      }
    },
    [api, ownedCollectionIds],
  );

  const saveCollectionMetadata = useCallback(
    async (collectionId: string, collectionMetada: CollectionMetadataData) => {
      if (api && activeAccount && activeWallet) {
        const metadataCid = await saveToIpfs(collectionMetada);

        await api.tx.nfts.setCollectionMetadata(collectionId, metadataCid).signAndSend(activeAccount.address, { signer: activeWallet.signer });
      }
    },
    [api, activeAccount, activeWallet],
  );

  useEffect(() => {
    getAccountCollectionsIds();
  }, [getAccountCollectionsIds, api]);

  return { getCollectionsMetadata, getCollectionMetadata, saveCollectionMetadata, collectionsMetadata, collectionMetadata };
};

export default useCollectionsMetadata;
