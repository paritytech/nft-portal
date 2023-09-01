import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { ViewType } from '@helpers/config.ts';
import { NftMetadata } from '@helpers/interfaces.ts';
import { SItemDescription, SItemImage, SItemName } from '@helpers/reusableStyles.ts';

import ActionBlock from './ActionBlock.tsx';

const SCol = styled.td`
  vertical-align: top;
`;

const SActionBlock = styled.td`
  vertical-align: middle;
`;

interface NftRowProps {
  nftMetadata: NftMetadata;
  viewType: ViewType;
}

const NftRow = ({ nftMetadata, viewType }: NftRowProps) => {
  const { collectionId } = useParams();
  const { id, name, description, image } = nftMetadata;

  return (
    <tr>
      <SItemImage>
        <ShowImage imageCid={image} altText={description} />
      </SItemImage>
      <SCol>
        <div>ID #{id}</div>
        <SItemName>{name}</SItemName>
        <SItemDescription>{description}</SItemDescription>
      </SCol>
      <SActionBlock>
        <ActionBlock viewType={viewType} collectionId={collectionId} nftId={id} />
      </SActionBlock>
    </tr>
  );
};

export default memo(NftRow);
