import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { CollectionMetadata } from '@helpers/interfaces.ts';
import { SItemDescription, SItemImage, SItemName } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import { useCountOwnedNfts } from '@hooks/useCountOwnedNfts.ts';

const SRow = styled.tr`
  cursor: pointer;
`;

interface CollectionRowProps {
  collectionMetadata: CollectionMetadata;
}

const CollectionRow = ({ collectionMetadata }: CollectionRowProps) => {
  const { id, name, description, image } = collectionMetadata;
  const counter = useCountOwnedNfts(id);
  const navigate = useNavigate();

  const openCollection = () => {
    navigate(routes.myAssets.nfts(id));
  };

  return (
    <SRow onClick={openCollection}>
      <SItemImage>
        <ShowImage imageCid={image} altText={description} />
      </SItemImage>
      <td>
        <SItemName>{name}</SItemName>
        <SItemDescription>{counter}</SItemDescription>
      </td>
    </SRow>
  );
};

export default memo(CollectionRow);
