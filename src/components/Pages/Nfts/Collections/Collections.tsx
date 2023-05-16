import { memo, useEffect } from 'react';
import { Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton.tsx';

import { routes } from '@helpers/routes.ts';

import { useCollections } from '@hooks/useCollections.ts';

import CollectionsView from './CollectionsView.tsx';

const Collections = () => {
  const { getCollectionsMetadata, collectionsMetadata } = useCollections();

  useEffect(() => {
    getCollectionsMetadata();
  }, [getCollectionsMetadata]);

  return (
    <>
      <CollectionsView collectionsMetadata={collectionsMetadata} />
      <Stack direction='horizontal' gap={2} className='justify-content-end'>
        <Link to={routes.myAssets.createCollection}>
          <ActionButton className='main S'>Create Collection</ActionButton>
        </Link>
      </Stack>
    </>
  );
};

export default memo(Collections);
