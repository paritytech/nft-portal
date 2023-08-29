import { memo } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { CollectionMetadata } from '@helpers/interfaces.ts';
import { CssFontRegularS, CssFontSemiBoldL } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';
import { SCard } from '@helpers/styledComponents.ts';

import { useCountOwnedNfts } from '@hooks/useCountOwnedNfts.ts';

const SLinkCard = styled(SCard)`
  cursor: pointer;

  .card-img {
    border-radius: 12px;
  }

  .card-title {
    ${CssFontSemiBoldL}
  }

  .card-text {
    ${CssFontRegularS}
    color: ${({ theme }) => theme.textAndIconsTertiary}
  }
`;

interface CollectionCardProps {
  collectionMetadata: CollectionMetadata;
}

const CollectionCard = ({ collectionMetadata }: CollectionCardProps) => {
  const { id, name, description, image } = collectionMetadata;
  const counter = useCountOwnedNfts(id);
  const navigate = useNavigate();

  const goIntoCollection = () => {
    navigate(routes.myAssets.nfts(id));
  };

  return (
    <SLinkCard onClick={goIntoCollection}>
      <ShowImage imageCid={image} altText={description} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{counter}</Card.Text>
      </Card.Body>
    </SLinkCard>
  );
};

export default memo(CollectionCard);
