import { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';

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

const SCollectionOption = styled.div``;

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
        <ActionButton className='main S call-to-action'>
          <Link to={routes.myAssets.createCollection}>Create New Collection</Link>
        </ActionButton>
      </SContainer>
    );
  }

  return (
    <SContainer>
      <ActionButton className='main S call-to-action full-width'>
        <Link to={routes.myAssets.createCollection}>Create New Collection</Link>
      </ActionButton>
      <SChoose>or select the created one</SChoose>
      {collectionsMetadata.map((collectionMetadata) => (
        <SCollectionOption key={collectionMetadata.id}>
          <Link to={routes.myAssets.mintNft(collectionMetadata.id)}>{collectionMetadata.name}</Link>
        </SCollectionOption>
      ))}
    </SContainer>
  );
};

export default memo(SelectCollection);
