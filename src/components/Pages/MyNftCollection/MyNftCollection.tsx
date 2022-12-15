import { memo } from 'react';
import Stack from 'react-bootstrap/Stack';

import { SContentBlockContainer } from '@helpers/styles';
import { useCollections } from '@hooks/useCollections';
import NewCollection from './NewCollection';
import NftCollections from './NftCollections';

const MyNftCollection = () => {
  const { getCollectionsMetadata, collectionsMetadata, createNewCollection, isCollectionDataSaving } = useCollections();

  return (
    <>
      <SContentBlockContainer>
        <NftCollections getCollectionsMetadata={getCollectionsMetadata} collectionsMetadata={collectionsMetadata} />
      </SContentBlockContainer>
      <Stack direction='horizontal' gap={2} className='justify-content-end'>
        <NewCollection createNewCollection={createNewCollection} isCollectionDataSaving={isCollectionDataSaving} />
      </Stack>
    </>
  );
};

export default memo(MyNftCollection);
