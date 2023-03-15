import { memo } from 'react';
import Card from 'react-bootstrap/esm/Card';
import { Link, useParams } from 'react-router-dom';

import ShowImage from '@common/ShowImage';

import { useAccounts } from '@contexts/AccountsContext';

import { NftMetadata } from '@helpers/interfaces';
import { SContentBlock } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';
import { SCard, SCardEdit } from '@helpers/styledComponents';

import EditIcon from '@images/edit-icon.svg';

interface NftProps {
  nftMetadata: NftMetadata;
}

const Nft = ({ nftMetadata }: NftProps) => {
  const { theme } = useAccounts();
  const { collectionId } = useParams();
  const { id, name, description, image } = nftMetadata;

  return (
    <SContentBlock key={id}>
      <SCard activetheme={theme}>
        <ShowImage imageCid={image} altText={description} />
        <Card.Body>
          <SCardEdit className='text-muted'>
            <span>NFT ID #{id}</span>
            <Link to={routes.nftEdit(collectionId, id)}>
              Edit
              <EditIcon />
            </Link>
          </SCardEdit>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{description}</Card.Text>
        </Card.Body>
      </SCard>
    </SContentBlock>
  );
};

export default memo(Nft);
