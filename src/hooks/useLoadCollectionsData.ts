import { useEffect } from 'react';

import { useCollections } from '@hooks/useCollections.ts';

export const useLoadCollectionsData = (owned?: boolean) => {
  const { getCollectionsMetadata, collectionsMetadata, isCollectionDataLoading } = useCollections();

  useEffect(() => {
    getCollectionsMetadata(owned);
  }, [getCollectionsMetadata, owned]);

  return { collectionsMetadata, isCollectionDataLoading };
};
