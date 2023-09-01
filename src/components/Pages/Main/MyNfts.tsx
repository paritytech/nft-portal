import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import Loader from '@common/Loader.tsx';
import Title from '@common/Title.tsx';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { SContentBlockContainer } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import { useLoadCollectionsData } from '@hooks/useLoadCollectionsData.ts';

import CollectionCard from '@pages/MyAssets/Collections/CollectionCard.tsx';

const STitle = styled(Title)`
  text-align: center;
`;

const MyNfts = () => {
  const navigate = useNavigate();
  const { collectionsMetadata, isCollectionDataLoading } = useLoadCollectionsData(false);
  const { storedChain, activeAccount } = useAccounts();

  if (!activeAccount || !storedChain) {
    return null;
  }

  if (!collectionsMetadata || isCollectionDataLoading) {
    return <Loader isSpinning={true} />;
  }

  if (collectionsMetadata.length === 0) {
    return (
      <div className='text-center'>
        <p>
          You don&apos;t have any NFTs on <b>{storedChain.title}</b> chain
          <br />
          use the <u>menu above</u> to create your own NFTs or
          <br />
          try switching to a different chain
        </p>
      </div>
    );
  }

  return (
    <>
      <STitle className='secondary'>My NFTs</STitle>
      <SContentBlockContainer>
        {collectionsMetadata.map((collectionMetadata) => (
          <CollectionCard
            key={collectionMetadata.id}
            collectionMetadata={collectionMetadata}
            openCollection={() => navigate(routes.myAssets.ownedNfts(collectionMetadata.id))}
          />
        ))}
      </SContentBlockContainer>
    </>
  );
};

export default memo(MyNfts);
