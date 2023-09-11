import { memo } from 'react';
import { styled } from 'styled-components';

import Loader from '@common/Loader.tsx';
import Title from '@common/Title.tsx';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { ViewType } from '@helpers/config.ts';
import { SContentBlockContainer } from '@helpers/reusableStyles.ts';

import { useLoadCollectionsMetadata } from '@hooks/useLoadCollectionsMetadata.ts';

import CollectionCard from '@pages/MyAssets/Collections/CollectionCard.tsx';

const STitle = styled(Title)`
  text-align: center;
`;

const MyNfts = () => {
  const { collectionsMetadata, isCollectionsMetadataLoading } = useLoadCollectionsMetadata(false);
  const { storedChain, activeAccount } = useAccounts();

  if (!activeAccount || !storedChain) {
    return null;
  }

  if (!collectionsMetadata || isCollectionsMetadataLoading) {
    return <Loader isSpinning />;
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
            viewType={ViewType.READ}
          />
        ))}
      </SContentBlockContainer>
    </>
  );
};

export default memo(MyNfts);
