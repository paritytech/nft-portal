import { memo } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

import EditIcon from '@assets/edit-icon.svg';

import ShowImage from '@common/ShowImage';

import { useAccounts } from '@contexts/AccountsContext';

import { CollectionMetadata } from '@helpers/interfaces';
import { SContentBlock } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';
import { SBasicButtonMini, SCard, SCardEdit } from '@helpers/styledComponents';

interface CollectionProps {
  collectionMetadata: CollectionMetadata;
}

const Collection = ({ collectionMetadata }: CollectionProps) => {
  const { theme } = useAccounts();
  const { id, name, description, image } = collectionMetadata;

  return (
    <SContentBlock>
      <SCard activetheme={theme}>
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
      </SCard>
    </SContentBlock>
  );
};

export default memo(Collection);
