import { memo } from 'react';
import Card from 'react-bootstrap/esm/Card';
import { Link } from 'react-router-dom';

import ShowImage from '@common/ShowImage';

import { useAccounts } from '@contexts/AccountsContext';

import { CollectionMetadata } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SBasicButtonMini, SCard, SCardEdit } from '@helpers/styledComponents';

import EditIcon from '@images/icons/edit.svg';

interface CollectionProps {
  collectionMetadata: CollectionMetadata;
}

const Collection = ({ collectionMetadata }: CollectionProps) => {
  const { theme } = useAccounts();
  const { id, name, description, image } = collectionMetadata;

  return (
    <SCard activetheme={theme}>
      <ShowImage imageCid={image} altText={description} />
      <Card.Body>
        <SCardEdit className='text-muted'>
          <span>Collection ID #{id}</span>
          <Link to={routes.myAssets.collectionEdit(id)}>
            Edit
            <EditIcon />
          </Link>
        </SCardEdit>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Footer className='text-center'>
        <Link to={routes.myAssets.nfts(id)}>
          <SBasicButtonMini>Show NFTs</SBasicButtonMini>
        </Link>
      </Card.Footer>
    </SCard>
  );
};

export default memo(Collection);
