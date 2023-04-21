import { truncate } from 'lodash';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';
import IconArrowButton from '@buttons/IconArrowButton';

import { CollectionMetadata } from '@helpers/interfaces';
import { CssFontRegularM, CssFontSemiBoldXL } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

const SContainer = styled.div`
  width: 460px;
  padding: 0 8px;
  text-align: center;
  margin: 0 auto;
`;

const SNote = styled.div`
  ${CssFontSemiBoldXL}
  margin-bottom: 40px;
`;

const SChoose = styled.div`
  ${CssFontRegularM}
  margin: 24px 0;
  color: ${({ theme }) => theme.textAndIconsSecondary};
`;

const SCollectionOption = styled(Link)`
  text-decoration: none;
`;

interface SelectCollectionProps {
  collectionsMetadata: CollectionMetadata[] | null;
}

const SelectCollection = ({ collectionsMetadata }: SelectCollectionProps) => {
  if (collectionsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(collectionsMetadata) && collectionsMetadata.length === 0) {
    return (
      <SContainer>
        <SNote>
          You don't have any
          <br />
          collections yet, create
          <br />a new one
        </SNote>
        <Link to={routes.myAssets.createCollection}>
          <ActionButton className='main S call-to-action'>Create New Collection</ActionButton>
        </Link>
      </SContainer>
    );
  }

  return (
    <SContainer>
      <Link to={routes.myAssets.createCollection}>
        <ActionButton className='main S call-to-action full-width'>Create New Collection</ActionButton>
      </Link>
      <SChoose>or select the created one</SChoose>
      {collectionsMetadata.map((collectionMetadata) => (
        <SCollectionOption to={routes.myAssets.mintNft(collectionMetadata.id)} key={collectionMetadata.id}>
          <IconArrowButton imageCid={collectionMetadata.image}>
            {truncate(collectionMetadata.name, { length: 20 })}
          </IconArrowButton>
        </SCollectionOption>
      ))}
    </SContainer>
  );
};

export default memo(SelectCollection);
