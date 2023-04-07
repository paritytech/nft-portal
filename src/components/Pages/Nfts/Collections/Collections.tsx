import { memo, useEffect } from 'react';
import Stack from 'react-bootstrap/esm/Stack';
import { Link } from 'react-router-dom';

import BasicButton from '@buttons/BasicButton';

import { routes } from '@helpers/routes';

import { useCollections } from '@hooks/useCollections';

import CollectionsView from './CollectionsView';

const Collections = () => {
  const { getCollectionsMetadata, collectionsMetadata } = useCollections();

  useEffect(() => {
    getCollectionsMetadata();
  }, [getCollectionsMetadata]);

  return (
    <>
      <CollectionsView collectionsMetadata={collectionsMetadata} />
      <Stack direction='horizontal' gap={2} className='justify-content-end'>
        <Link to={routes.myAssets.collectionMint}>
          <BasicButton>Mint Collection</BasicButton>
        </Link>
      </Stack>
    </>
  );
};

export default memo(Collections);
