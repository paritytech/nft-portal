import { memo, useEffect } from 'react';

import { useCollections } from '@hooks/useCollections.ts';

import CollectionsView from './CollectionsView.tsx';

const Collections = () => {
  const { getCollectionsMetadata, collectionsMetadata } = useCollections();

  useEffect(() => {
    getCollectionsMetadata();
  }, [getCollectionsMetadata]);

  return <CollectionsView collectionsMetadata={collectionsMetadata} />;
};

export default memo(Collections);
