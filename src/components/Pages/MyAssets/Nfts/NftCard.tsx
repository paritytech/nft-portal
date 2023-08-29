import { memo } from 'react';
import { Card } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import ShowImage from '@common/ShowImage.tsx';

import { NftMetadata } from '@helpers/interfaces.ts';
import { routes } from '@helpers/routes.ts';
import { SCard, SCardEdit } from '@helpers/styledComponents.ts';

import EditIcon from '@images/icons/edit.svg';

interface NftCardProps {
  nftMetadata: NftMetadata;
}

const NftCard = ({ nftMetadata }: NftCardProps) => {
  const { collectionId } = useParams();
  const { id, name, description, image } = nftMetadata;

  return (
    <SCard>
      <ShowImage imageCid={image} altText={description} />
      <Card.Body>
        <SCardEdit className='text-muted'>
          <span>ID #{id}</span>
          <Link to={routes.myAssets.nftEdit(collectionId, id)}>
            Edit
            <EditIcon />
          </Link>
        </SCardEdit>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </SCard>
  );
};

export default memo(NftCard);
