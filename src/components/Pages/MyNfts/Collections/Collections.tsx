import { memo, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

import EditIcon from '@assets/edit-icon.svg';

import ShowImage from '@common/ShowImage';

import { useAccounts } from '@contexts/AccountContext';

import { CollectionMetadata } from '@helpers/interfaces';
import { SContentBlock } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';
import { SBasicButtonMini, SCardEdit } from '@helpers/styledComponents';

interface CollectionsProps {
  getCollectionsMetadata: () => void;
  collectionsMetadata: CollectionMetadata[] | null;
}

const Collections = ({ getCollectionsMetadata, collectionsMetadata }: CollectionsProps) => {
  const { theme } = useAccounts();

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
        <SContentBlock key={id} activeTheme={theme}>
          <Card>
            <ShowImage imageCid={image} altText={description} />
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
