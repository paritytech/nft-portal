import { memo, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { CollectionMetadata } from '@helpers/interfaces.ts';
import { CssFontRegularS, CssFontSemiBoldL } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';
import { SCard } from '@helpers/styledComponents.ts';

import { useNfts } from '@hooks/useNfts.ts';

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

interface CollectionProps {
  collectionMetadata: CollectionMetadata;
}

const Collection = ({ collectionMetadata }: CollectionProps) => {
  const { id, name, description, image } = collectionMetadata;
  const { getOwnedNftIds } = useNfts(id);
  const navigate = useNavigate();
  const [itemCounter, setItemCounter] = useState<number>();

  const goIntoCollection = () => {
    navigate(routes.myAssets.nfts(id));
  };

  useEffect(() => {
    const countOwnedItems = async () => {
      const ownedNftIds = await getOwnedNftIds();

      if (Array.isArray(ownedNftIds)) {
        setItemCounter(ownedNftIds.length);
      } else {
        setItemCounter(0);
      }
    };

    countOwnedItems();
  }, []);

  const counter = typeof itemCounter !== 'undefined' ? `${itemCounter} items` : '...';

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

export default memo(Collection);
