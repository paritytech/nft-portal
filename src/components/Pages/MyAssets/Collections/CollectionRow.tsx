import { memo } from 'react';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { ViewType } from '@helpers/config.ts';
import { CollectionMetadata } from '@helpers/interfaces.ts';
import { SItemDescription, SItemImage, SItemName, SRowActionBlock } from '@helpers/reusableStyles.ts';

import { useCountOwnedNfts } from '@hooks/useCountOwnedNfts.ts';

import CollectionActionBlock from './CollectionActionBlock.tsx';

const SCol = styled.td`
  vertical-align: top;
`;

interface CollectionRowProps {
  collectionMetadata: CollectionMetadata;
  viewType: ViewType;
}

const CollectionRow = ({ collectionMetadata, viewType }: CollectionRowProps) => {
  const { id, name, description, image } = collectionMetadata;
  const counter = useCountOwnedNfts(id);

  return (
    <tr>
      <SItemImage>
        <ShowImage imageCid={image} altText={description} />
      </SItemImage>
      <SCol>
        <SItemName>{name}</SItemName>
        <SItemDescription>{counter}</SItemDescription>
        <SItemDescription>{description}</SItemDescription>
        <SRowActionBlock>
          <CollectionActionBlock viewType={viewType} collectionId={id} />
        </SRowActionBlock>
      </SCol>
    </tr>
  );
};

export default memo(CollectionRow);
