import { memo } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { ViewType } from '@helpers/config.ts';
import { NftMetadata } from '@helpers/interfaces.ts';
import { SCard } from '@helpers/styledComponents.ts';

import ActionBlock from './ActionBlock.tsx';

const SActionBlock = styled.div`
  display: flex;
  justify-content: center;

  button {
    width: 50%;
  }
`;

interface NftCardProps {
  nftMetadata: NftMetadata;
  viewType: ViewType;
}

const NftCard = ({ nftMetadata, viewType }: NftCardProps) => {
  const { collectionId } = useParams();
  const { id, name, description, image } = nftMetadata;

  return (
    <SCard>
      <ShowImage imageCid={image} altText={description} />
      <Card.Body>
        <div>ID #{id}</div>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <SActionBlock>
          <ActionBlock viewType={viewType} collectionId={collectionId} nftId={id} />
        </SActionBlock>
      </Card.Body>
    </SCard>
  );
};

export default memo(NftCard);
