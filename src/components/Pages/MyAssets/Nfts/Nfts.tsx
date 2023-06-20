import { memo, useEffect } from 'react';
import { Stack } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton.tsx';

import { routes } from '@helpers/routes.ts';

import { useNfts } from '@hooks/useNfts.ts';

import NftsView from './NftsView.tsx';

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
      <Stack direction='horizontal' gap={2} className='justify-content-end'>
        <Link to={routes.myAssets.mintNft(collectionId)}>
          <ActionButton className='main'>Create NFT</ActionButton>
        </Link>
        <Link to='..'>
          <ActionButton type='button' className='secondary'>
            Back
          </ActionButton>
        </Link>
      </Stack>
    </>
  );
};

export default memo(Nfts);
