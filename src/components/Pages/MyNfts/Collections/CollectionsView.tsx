import { memo } from 'react';
import Stack from 'react-bootstrap/Stack';

import ActionButton from '@buttons/ActionButton';

import ModalStatus from '@common/ModalStatus';

import { SContentBlockContainer } from '@helpers/reusableStyles';

import { useCollections } from '@hooks/useCollections';

import Collections from './Collections';

const CollectionsView = () => {
  const { getCollectionsMetadata, collectionsMetadata, mintCollection, isCollectionDataSaving } = useCollections();

  return (
    <>
      <ModalStatus />
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
