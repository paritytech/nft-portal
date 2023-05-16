import { memo } from 'react';

import { CollectionMetadata } from '@helpers/interfaces.ts';
import { SContentBlockContainer } from '@helpers/reusableStyles.ts';

import Collection from './Collection.tsx';

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
    <SContentBlockContainer>
      {collectionsMetadata.map((collectionMetadata) => (
        <Collection key={collectionMetadata.id} collectionMetadata={collectionMetadata} />
      ))}
    </SContentBlockContainer>
  );
};

export default memo(CollectionsView);
