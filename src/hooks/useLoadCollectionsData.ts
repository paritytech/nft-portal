import { useEffect } from 'react';

import { useCollections } from '@hooks/useCollections.ts';

export const useLoadCollectionsData = () => {
  const { getCollectionsMetadata, collectionsMetadata } = useCollections();

  useEffect(() => {
    getCollectionsMetadata();
  }, [getCollectionsMetadata]);

  return collectionsMetadata;
};
