import { memo } from 'react';
import styled from 'styled-components';

import { CollectionMetadata } from '../../constants';

const SCollectionBlock = styled.div`
  width: 250px;
  word-break: break-word;
`

interface NftCollectionProps {
  collectionMetadata: CollectionMetadata;
}

const NftCollection = ({ collectionMetadata }: NftCollectionProps) => {
  const { id, name, description, image } = collectionMetadata;

  return (
    <SCollectionBlock>
      <div>{id}</div>
      <div>{name}</div>
      <div>{description}</div>
      <div>{image}</div>
    </SCollectionBlock>
  );
};

export default memo(NftCollection);
