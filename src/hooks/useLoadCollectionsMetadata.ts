import { useEffect } from 'react';

import { useCollections } from '@hooks/useCollections.ts';

export const useLoadCollectionsMetadata = (owned?: boolean) => {
  const { getCollectionsMetadata, collectionsMetadata, isCollectionsMetadataLoading } = useCollections();

  useEffect(() => {
    getCollectionsMetadata(owned);
  }, [getCollectionsMetadata, owned]);

  return { collectionsMetadata, isCollectionsMetadataLoading };
};
