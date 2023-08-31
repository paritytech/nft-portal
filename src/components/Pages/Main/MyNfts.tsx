import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import Title from '@common/Title.tsx';

import { SContentBlockContainer } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import { useLoadCollectionsData } from '@hooks/useLoadCollectionsData.ts';

import CollectionCard from '@pages/MyAssets/Collections/CollectionCard.tsx';

const MyNfts = () => {
  const navigate = useNavigate();
  const collectionsMetadata = useLoadCollectionsData(false);

  if (!collectionsMetadata || collectionsMetadata.length === 0) {
    return null;
  }

  return (
    <>
      <Title className='secondary'>My NFTs</Title>

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
