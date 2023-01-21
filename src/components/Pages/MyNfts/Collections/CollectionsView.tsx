import { memo } from 'react';
import Stack from 'react-bootstrap/Stack';

import ActionButton from '@buttons/ActionButton';

import { SContentBlockContainer } from '@helpers/styles';

import { useCollections } from '@hooks/useCollections';

import Collections from './Collections';

const CollectionsView = () => {
  const { getCollectionsMetadata, collectionsMetadata, mintCollection, isCollectionDataSaving } = useCollections();

  return (
    <>
      <SContentBlockContainer>
        <Collections getCollectionsMetadata={getCollectionsMetadata} collectionsMetadata={collectionsMetadata} />
      </SContentBlockContainer>
      <Stack direction='horizontal' gap={2} className='justify-content-end'>
        <ActionButton action={mintCollection} isDisabled={isCollectionDataSaving}>
          {isCollectionDataSaving ? 'Minting collection' : 'Mint new collection'}
        </ActionButton>
      </Stack>
    </>
  );
};

export default memo(CollectionsView);
