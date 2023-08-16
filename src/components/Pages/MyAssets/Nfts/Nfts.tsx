import { memo, useEffect } from 'react';
import { Stack } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton.tsx';

import { routes } from '@helpers/routes.ts';

import { useNfts } from '@hooks/useNfts.ts';

import NftsView from './NftsView.tsx';
import { SPageControls } from '@helpers/reusableStyles.ts';

const Nfts = () => {
  const { collectionId } = useParams();
  const { getNftsMetadata, nftsMetadata } = useNfts(collectionId || '');

  useEffect(() => {
    if (collectionId) {
      getNftsMetadata();
    }
  }, [getNftsMetadata, collectionId]);

  return (
    <>
      <NftsView nftsMetadata={nftsMetadata} />

      <SPageControls>
        <Stack direction='horizontal' gap={3}>
          <Link to='..' className='w-25'>
            <ActionButton type='button' className='stroke w-100'>
              Back
            </ActionButton>
          </Link>
          <Link to={routes.myAssets.mintNft(collectionId)} className='w-75'>
            <ActionButton className='secondary w-100'>Create NFT</ActionButton>
          </Link>
        </Stack>
      </SPageControls>
    </>
  );
};

export default memo(Nfts);
