import { CollectionMetadata } from '@helpers/interfaces';
import { memo, useEffect } from 'react';

import NftCollection from './NftCollection';

interface NftCollectionsProps {
  getCollectionsMetadata: () => void,
  collectionsMetadata: CollectionMetadata[] | null,
}

const NftCollections = ({ getCollectionsMetadata, collectionsMetadata }: NftCollectionsProps) => {
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
      {collectionsMetadata &&
        collectionsMetadata.map((collectionMetadata: any) => <NftCollection key={collectionMetadata.id} collectionMetadata={collectionMetadata} />)}
    </>
  );
};

export default memo(NftCollections);
