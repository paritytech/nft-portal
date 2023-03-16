import { memo } from 'react';

import { CollectionMetadata } from '@helpers/interfaces';

import Collection from './Collection';

interface CollectionsViewProps {
  collectionsMetadata: CollectionMetadata[] | null;
}

const CollectionsView = ({ collectionsMetadata }: CollectionsViewProps) => {
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

export default memo(CollectionsView);
