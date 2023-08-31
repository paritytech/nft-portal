import { memo } from 'react';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { NftMetadata } from '@helpers/interfaces.ts';
import { CssFontRegularS, CssFontSemiBoldL } from '@helpers/reusableStyles.ts';

const SCol = styled.td`
  vertical-align: top;
`;

const STableImage = styled.td`
  width: 100px;
`;

const SName = styled.div`
  ${CssFontSemiBoldL};
`;

const SDesc = styled.div`
  ${CssFontRegularS};
`;

const SRowLink = styled.tr`
  cursor: pointer;
`;

interface OwnedNftRowProps {
  nftMetadata: NftMetadata;
  openNft: () => void;
}

const OwnedNftRow = ({ nftMetadata, openNft }: OwnedNftRowProps) => {
  const { id, name, description, image } = nftMetadata;

  return (
    <SRowLink onClick={openNft}>
      <STableImage>
        <ShowImage imageCid={image} altText={description} />
      </STableImage>
      <SCol>
        <div>ID #{id}</div>
        <SName>{name}</SName>
        <SDesc>{description}</SDesc>
      </SCol>
    </SRowLink>
  );
};

export default memo(OwnedNftRow);
