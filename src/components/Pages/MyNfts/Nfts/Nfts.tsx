import { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import EditIcon from '@assets/edit-icon.svg';
import ShowImage from '@common/ShowImage';
import { NftMetadata } from '@helpers/interfaces';
import { SCardEdit, SContentBlock } from '@helpers/styles';
import { routes } from '@helpers/routes';

interface NftsProps {
  nftsMetadata: NftMetadata[] | null;
}

const Nfts = ({ nftsMetadata }: NftsProps) => {
  const { collectionId } = useParams();

  if (nftsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(nftsMetadata) && nftsMetadata.length === 0) {
    return <>No NFTs found</>;
  }

  return (
    <>
      {nftsMetadata.map(({ id, name, description, image }) => (
        <SContentBlock key={id}>
          <Card>
            <ShowImage image={image} altText={description} />
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
          </Card>
        </SContentBlock>
      ))}
    </>
  );
};

export default memo(Nfts);
