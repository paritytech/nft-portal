import { truncate } from 'lodash';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

import ActionButton from '@buttons/ActionButton.tsx';
import IconArrowButton from '@buttons/IconArrowButton.tsx';

import { CssFontRegularM, CssFontSemiBoldL } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import { useLoadCollectionsData } from '@hooks/useLoadCollectionsData.ts';

import CollectionIcon from '@images/icons/collection.svg';

const SContainer = styled.div`
  max-width: 458px;
  padding: 32px;
  text-align: center;
  margin: 0 auto;
  border: 1px solid ${({ theme }) => theme.appliedStroke};
  border-radius: 24px;
`;

const SHugeIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 136px;
  height: 136px;
  margin: 12px auto 32px;
  background-color: ${({ theme }) => theme.fill6};
  border-radius: 104px;

  svg {
    width: 72px;
    height: 72px;
  }
`;

const SNote = styled.div`
  ${CssFontSemiBoldL}
  margin-bottom: 32px;
`;

const SChoose = styled.div`
  ${CssFontRegularM}
  margin: 24px 0;
  color: ${({ theme }) => theme.textAndIconsPrimary};
`;

const SCollectionOption = styled(Link)`
  display: block;
  text-decoration: none;

  & + a {
    margin-top: 8px;
  }
`;

const SelectCollection = () => {
  const collectionsMetadata = useLoadCollectionsData();

  if (collectionsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(collectionsMetadata) && collectionsMetadata.length === 0) {
    return (
      <SContainer>
        <SHugeIcon>
          <CollectionIcon />
        </SHugeIcon>
        <SNote>
          You don&apos;t have any collections
          <br />
          yet, create a new one
        </SNote>
        <Link to={routes.myAssets.createCollection}>
          <ActionButton className='main-king w-100'>Create New Collection</ActionButton>
        </Link>
      </SContainer>
    );
  }

  return (
    <SContainer>
      <Link to={routes.myAssets.createCollection}>
        <ActionButton className='main-king w-100'>Create New Collection</ActionButton>
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
