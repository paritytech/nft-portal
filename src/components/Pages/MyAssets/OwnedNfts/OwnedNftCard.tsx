import { memo } from 'react';
import { Card } from 'react-bootstrap';

import ShowImage from '@common/ShowImage.tsx';

import { NftMetadata } from '@helpers/interfaces.ts';
import { SLinkCard } from '@helpers/styledComponents.ts';

interface OwnedNftCardProps {
  nftMetadata: NftMetadata;
  openNft: () => void;
}

const OwnedNftCard = ({ nftMetadata, openNft }: OwnedNftCardProps) => {
  const { id, name, description, image } = nftMetadata;

  return (
    <SLinkCard openNft={openNft}>
      <ShowImage imageCid={image} altText={description} />
      <Card.Body>
        <div>ID #{id}</div>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </SLinkCard>
  );
};

export default memo(OwnedNftCard);
