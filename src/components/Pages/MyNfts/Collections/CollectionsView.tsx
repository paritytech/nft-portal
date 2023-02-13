import { memo } from 'react';
import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';

import BasicButton from '@buttons/BasicButton';

import { SContentBlockContainer } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

import { useCollections } from '@hooks/useCollections';

import Collections from './Collections';

const CollectionsView = () => {
  const { getCollectionsMetadata, collectionsMetadata } = useCollections();

  return (
    <>
      <SContentBlockContainer>
        <Collections getCollectionsMetadata={getCollectionsMetadata} collectionsMetadata={collectionsMetadata} />
      </SContentBlockContainer>
      <Stack direction='horizontal' gap={2} className='justify-content-end'>
        <Link to={routes.collectionMint}>
          <BasicButton>Mint Collection</BasicButton>
        </Link>
      </Stack>
    </>
  );
};

export default memo(CollectionsView);
