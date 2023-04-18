import { memo, useEffect } from 'react';

import { useCollections } from '@hooks/useCollections';

import SelectCollection from './SelectCollection';

const LoadCollectionsData = () => {
  const { getCollectionsMetadata, collectionsMetadata } = useCollections();

  useEffect(() => {
    getCollectionsMetadata();
  }, [getCollectionsMetadata]);

  return <SelectCollection collectionsMetadata={collectionsMetadata} />;
};

export default memo(LoadCollectionsData);
