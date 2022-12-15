import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import EditIcon from '@assets/edit-icon.svg';
import ShowImage from '@common/ShowImage';
import { CollectionMetadata } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SBasicButtonMini, SCardEdit, SContentBlock } from '@helpers/styles';

interface CollectionsProps {
  getCollectionsMetadata: () => void;
  collectionsMetadata: CollectionMetadata[] | null;
}

const Collections = ({ getCollectionsMetadata, collectionsMetadata }: CollectionsProps) => {
  useEffect(() => {
    getCollectionsMetadata();
  }, [getCollectionsMetadata]);

  if (collectionsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(collectionsMetadata) && collectionsMetadata.length === 0) {
    return <>No collections found</>;
  }

  return (
    <>
      {collectionsMetadata.map(({ id, name, description, image }) => (
        <SContentBlock key={id}>
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
      ))}
    </>
  );
};

export default memo(Collections);
