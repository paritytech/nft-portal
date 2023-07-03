import { memo } from 'react';

import { SContentBlockContainer } from '@helpers/reusableStyles.ts';

import { useLoadCollectionsData } from '@hooks/useLoadCollectionsData.ts';

import Collection from './Collection.tsx';

const CollectionsView = () => {
  const collectionsMetadata = useLoadCollectionsData();

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
