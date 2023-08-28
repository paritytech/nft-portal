import { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { NftMetadata } from '@helpers/interfaces.ts';
import { CssFontRegularS, CssFontSemiBoldL } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import EditIcon from '@images/icons/edit.svg';

const STableImage = styled.td`
  width: 100px;
`;

const SName = styled.div`
  ${CssFontSemiBoldL};
`;

const SDesc = styled.div`
  ${CssFontRegularS};
`;

const SLink = styled(Link)`
  position: relative;

  svg {
    position: absolute;
    top: -3px;
    right: -40px;
    width: 20px;
    height: 20px;
  }
`;

interface NftRowProps {
  nftMetadata: NftMetadata;
}

const NftRow = ({ nftMetadata }: NftRowProps) => {
  const { collectionId } = useParams();
  const { id, name, description, image } = nftMetadata;

  return (
    <tr>
      <STableImage>
        <ShowImage imageCid={image} altText={description} />
      </STableImage>
      <td>
        <div>
          ID #{id}
          <SLink to={routes.myAssets.nftEdit(collectionId, id)}>
            <EditIcon />
          </SLink>
        </div>
        <SName>{name}</SName>
        <SDesc>{description}</SDesc>
      </td>
    </tr>
  );
};

export default memo(NftRow);
