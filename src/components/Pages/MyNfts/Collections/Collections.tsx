import { memo, useEffect } from 'react';

import { CollectionMetadata } from '@helpers/interfaces';

import Collection from './Collection';

interface CollectionsProps {
  getCollectionsMetadata: () => void;
  collectionsMetadata: CollectionMetadata[] | null;
}

const Collections = ({ getCollectionsMetadata, collectionsMetadata }: CollectionsProps) => {
  useEffect(() => {
    getCollectionsMetadata();
  }, [getCollectionsMetadata]);

  if (collectionsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(collectionsMetadata) && collectionsMetadata.length === 0) {
    return <>No collections found</>;
  }

  return (
    <>
      {collectionsMetadata.map((collectionMetadata) => (
        <Collection key={collectionMetadata.id} collectionMetadata={collectionMetadata} />
      ))}
    </>
  );
};

export default memo(Collections);
