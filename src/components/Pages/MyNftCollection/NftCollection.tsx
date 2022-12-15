import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import { CollectionMetadata } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SContentBlock, SActionButtonMini } from '@helpers/styles';
import ShowImage from '@common/ShowImage';

interface NftCollectionProps {
  collectionMetadata: CollectionMetadata;
}

const NftCollection = ({ collectionMetadata }: NftCollectionProps) => {
  const { id, name, description, image } = collectionMetadata;
  const navigate = useNavigate();

  return (
    <SContentBlock>
      <Card>
        <ShowImage image={image} altText={description} />
        <Card.Body className='pb-0'>
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle>Collection ID #{id}</Card.Subtitle>
          <Card.Text>{description}</Card.Text>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <SActionButtonMini action={() => navigate(routes.nftCollectionEdit(id))}>Edit metadata</SActionButtonMini>
            </ListGroup.Item>
            <ListGroup.Item>
              <SActionButtonMini action={() => navigate(routes.ownedNfts(id))}>Show NFTs</SActionButtonMini>
            </ListGroup.Item>
            <ListGroup.Item>
              <SActionButtonMini action={() => navigate(routes.nftMint(id))}>Mint NFT</SActionButtonMini>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </SContentBlock>
  );
};

export default memo(NftCollection);
