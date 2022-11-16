import { StorageKey, u32 } from '@polkadot/types';
import { PalletUniquesCollectionMetadata } from '@polkadot/types/lookup';
import { AccountId32 } from '@polkadot/types/interfaces';
import { useCallback, useEffect, useState } from 'react';

import { CollectionMetadata } from '../constants';
import { useAccounts } from '../Contexts';

const useCollectionsData = () => {
  const { api, activeAccount } = useAccounts();
  const [ownedCollectionIds, setOwnedCollectionIds] = useState<string[] | null>(null);
  const [collectionsMetadata, setCollectionsMetadata] = useState<CollectionMetadata[] | null>(null);

  const getAccountCollectionsIds = useCallback(async () => {
    if (api && activeAccount) {
      const results: StorageKey<[AccountId32, u32]>[] = await api.query.uniques.classAccount.keys(activeAccount.address);
      const collectionIds = results
        .map(({ args: [, collectionId] }) => collectionId)
        .sort((a, b) => a.cmp(b))
        .map((collectionId) => collectionId.toString());

      setOwnedCollectionIds(collectionIds);
    }

    return [];
  }, [api, activeAccount]);

  const getCollectionsData = useCallback(async () => {
    if (api && ownedCollectionIds) {
      let metadata: CollectionMetadata[] = [];
      const rawMetadata = await api.query.uniques.classMetadataOf.multi(ownedCollectionIds);

      if (Array.isArray(rawMetadata) && rawMetadata.length > 0) {
        const fetchCalls = rawMetadata.map((metadata) => {
          const primitiveMetadata = metadata.toPrimitive() as unknown as PalletUniquesCollectionMetadata;
          return fetch(`https://ipfs.io/ipfs/${primitiveMetadata.data}`);
        });

        const fetchedData = await Promise.all(fetchCalls);
        const parsedData = await Promise.all(fetchedData.map((data) => data.json()));

        metadata = parsedData.map((data, index) => ({
          id: ownedCollectionIds[index],
          name: data.name,
          description: data.description || null,
          image: data.image || null,
        }));
      }

      setCollectionsMetadata(metadata);
    }
  }, [api, ownedCollectionIds]);

  useEffect(() => {
    getAccountCollectionsIds();
  }, [getAccountCollectionsIds, api]);

  return { getCollectionsData, collectionsMetadata };
};

export default useCollectionsData;
