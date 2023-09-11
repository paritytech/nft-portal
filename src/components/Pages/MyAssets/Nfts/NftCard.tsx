import { memo } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import ShowImage from '@common/ShowImage.tsx';

import { ViewType } from '@helpers/config.ts';
import { NftMetadata } from '@helpers/interfaces.ts';
import { SCardActionBlock, SItemDescription, SItemName } from '@helpers/reusableStyles.ts';
import { SCard } from '@helpers/styledComponents.ts';

import NftActionBlock from './NftActionBlock.tsx';

interface NftCardProps {
  nftMetadata: NftMetadata;
  viewType: ViewType;
}

const NftCard = ({ nftMetadata, viewType }: NftCardProps) => {
  const { collectionId } = useParams();
  const { id, name, description, image } = nftMetadata;

  return (
    <SCard>
      <ShowImage imageCid={image} altText={description} />
      <Card.Body>
        <div>ID #{id}</div>
        <SItemName>{name}</SItemName>
        <SItemDescription>{description}</SItemDescription>
        <SCardActionBlock>
          <NftActionBlock viewType={viewType} collectionId={collectionId} nftId={id} />
        </SCardActionBlock>
      </Card.Body>
    </SCard>
  );
};

export default memo(NftCard);
