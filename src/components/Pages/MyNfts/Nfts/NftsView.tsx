import { memo, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import { Link, useParams } from 'react-router-dom';

import BasicButton from '@buttons/BasicButton';

import { routes } from '@helpers/routes';
import { SContentBlockContainer, SSecondaryButton } from '@helpers/styles';

import { useNfts } from '@hooks/useNfts';

import Nfts from './Nfts';

const NftsView = () => {
  const { collectionId } = useParams();
  const { getNftsMetadata, nftsMetadata } = useNfts(collectionId || '');

  useEffect(() => {
    if (collectionId) {
      getNftsMetadata();
    }
  }, [getNftsMetadata, collectionId]);

  return (
    <>
      <SContentBlockContainer>
        <Nfts nftsMetadata={nftsMetadata} />
      </SContentBlockContainer>
      <Stack direction='horizontal' gap={2} className='justify-content-end'>
        <Link to={routes.nftMint(collectionId)}>
          <BasicButton>Mint NFT</BasicButton>
        </Link>
        <Link to={routes.collections}>
          <SSecondaryButton type='button'>Back</SSecondaryButton>
        </Link>
      </Stack>
    </>
  );
};

export default memo(NftsView);
