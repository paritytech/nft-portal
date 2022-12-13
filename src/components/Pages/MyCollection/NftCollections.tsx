import { memo, useEffect } from 'react';

import { SContentBlockContainer } from '@helpers/styles';
import { useCollections } from '@hooks/useCollections';
import NftCollection from './NftCollection';

const NftCollections = () => {
  const { getCollectionsMetadata, collectionsMetadata } = useCollections();

  useEffect(() => {
    getCollectionsMetadata();
  }, [getCollectionsMetadata]);

  if (collectionsMetadata === null) {
    // TODO add button that leads to collection creation page
    return <>No collections found</>;
  }

  return (
    <SContentBlockContainer>
      {collectionsMetadata.map((collectionMetadata) => (
        <NftCollection key={collectionMetadata.id} collectionMetadata={collectionMetadata} />
      ))}
    </SContentBlockContainer>
  );
};

export default memo(NftCollections);