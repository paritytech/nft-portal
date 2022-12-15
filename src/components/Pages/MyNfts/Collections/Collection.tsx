import { memo } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import EditIcon from '@assets/edit-icon.svg';
import { CollectionMetadata } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SContentBlock, SBasicButtonMini, SCardEdit } from '@helpers/styles';
import ShowImage from '@common/ShowImage';

interface CollectionProps {
  collectionMetadata: CollectionMetadata;
}

const Collection = ({ collectionMetadata }: CollectionProps) => {
  const { id, name, description, image } = collectionMetadata;

  return (
    <SContentBlock>
      <Card>
        <ShowImage image={image} altText={description} />
        <Card.Body>
          <SCardEdit className='text-muted'>
            <span>Collection ID #{id}</span>
            <Link to={id}>
              Edit
              <EditIcon />
            </Link>
          </SCardEdit>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{description}</Card.Text>
        </Card.Body>
        <Card.Footer className='text-center'>
          <Link to={routes.nfts(id)}>
            <SBasicButtonMini>Show NFTs</SBasicButtonMini>
          </Link>
        </Card.Footer>
      </Card>
    </SContentBlock>
  );
};

export default memo(Collection);
