import { memo, useEffect } from 'react';
import styled from 'styled-components';

import { useCollectionsData } from '../../hooks';
import NftCollection from './NftCollection';

const SCollectionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
`

const NftCollections = () => {
  const { getCollectionsData, collectionsMetadata } = useCollectionsData();

  useEffect(() => {
    getCollectionsData();
  }, [getCollectionsData]);

  if (collectionsMetadata === null) {
    return null;
  }

  return (
    <SCollectionsContainer>
      {collectionsMetadata.map((collectionMetadata) => (
        <NftCollection key={collectionMetadata.id} collectionMetadata={collectionMetadata} />
      ))}
    </SCollectionsContainer>
  );
};

export default memo(NftCollections);
