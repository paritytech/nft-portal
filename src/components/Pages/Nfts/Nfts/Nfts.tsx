import { memo, useEffect } from 'react';
import Stack from 'react-bootstrap/esm/Stack';
import { Link, useParams } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton';

import { routes } from '@helpers/routes';

import { useNfts } from '@hooks/useNfts';

import NftsView from './NftsView';

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
        <Link to={routes.myAssets.nftMint(collectionId)}>
          <ActionButton className='main S'>Mint NFT</ActionButton>
        </Link>
        <Link to='..'>
          <ActionButton type='button' className='secondary S'>
            Back
          </ActionButton>
        </Link>
      </Stack>
    </>
  );
};

export default memo(Nfts);
