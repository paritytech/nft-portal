import { memo } from 'react';
import { Card } from 'react-bootstrap';

import ShowImage from '@common/ShowImage.tsx';

import { CollectionMetadata } from '@helpers/interfaces.ts';
import { SLinkCard } from '@helpers/styledComponents.ts';

import { useCountOwnedNfts } from '@hooks/useCountOwnedNfts.ts';

interface CollectionCardProps {
  collectionMetadata: CollectionMetadata;
  openCollection: () => void;
}

const CollectionCard = ({ collectionMetadata, openCollection }: CollectionCardProps) => {
  const { id, name, description, image } = collectionMetadata;
  const counter = useCountOwnedNfts(id);

  return (
    <SLinkCard onClick={openCollection}>
      <ShowImage imageCid={image} altText={description} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{counter}</Card.Text>
      </Card.Body>
    </SLinkCard>
  );
};

export default memo(CollectionCard);
