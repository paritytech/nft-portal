import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { CollectionMetadata } from '@helpers/interfaces.ts';
import { CssFontRegularS, CssFontSemiBoldL } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import { useCountOwnedNfts } from '@hooks/useCountOwnedNfts.ts';

const STableImage = styled.td`
  width: 100px;
`;

const SName = styled.div`
  ${CssFontSemiBoldL};
`;

const SCounter = styled.div`
  ${CssFontRegularS};
`;

interface CollectionTileProps {
  collectionMetadata: CollectionMetadata;
}

const CollectionTile = ({ collectionMetadata }: CollectionTileProps) => {
  const { id, name, description, image } = collectionMetadata;
  const counter = useCountOwnedNfts(id);
  const navigate = useNavigate();

  const goIntoCollection = () => {
    navigate(routes.myAssets.nfts(id));
  };

  return (
    <tr onClick={goIntoCollection}>
      <STableImage>
        <ShowImage imageCid={image} altText={description} />
      </STableImage>
      <td>
        <SName>{name}</SName>
        <SCounter>{counter}</SCounter>
      </td>
    </tr>
  );
};

export default memo(CollectionTile);
