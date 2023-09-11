import { memo } from 'react';
import { Card } from 'react-bootstrap';

import ShowImage from '@common/ShowImage.tsx';

import { ViewType } from '@helpers/config.ts';
import { CollectionMetadata } from '@helpers/interfaces.ts';
import { SCardActionBlock, SItemDescription, SItemName } from '@helpers/reusableStyles.ts';
import { SCard } from '@helpers/styledComponents.ts';

import { useCountOwnedNfts } from '@hooks/useCountOwnedNfts.ts';

import CollectionActionBlock from './CollectionActionBlock.tsx';

interface CollectionCardProps {
  collectionMetadata: CollectionMetadata;
  viewType: ViewType;
}

const CollectionCard = ({ collectionMetadata, viewType }: CollectionCardProps) => {
  const { id, name, description, image } = collectionMetadata;
  const counter = useCountOwnedNfts(id);

  return (
    <SCard>
      <ShowImage imageCid={image} altText={description} />
      <Card.Body>
        <SItemName>{name}</SItemName>
        <SItemDescription>{counter}</SItemDescription>
        <SItemDescription>{description}</SItemDescription>
        <SCardActionBlock>
          <CollectionActionBlock viewType={viewType} collectionId={id} />
        </SCardActionBlock>
      </Card.Body>
    </SCard>
  );
};

export default memo(CollectionCard);
