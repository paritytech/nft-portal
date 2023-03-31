import { memo, useEffect } from 'react';
import Stack from 'react-bootstrap/esm/Stack';
import { Link, useParams } from 'react-router-dom';

import BasicButton from '@buttons/BasicButton';

import { useAccounts } from '@contexts/AccountsContext';

import { SContentBlockContainer } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';

import { useNfts } from '@hooks/useNfts';

import NftsView from './NftsView';

const Nfts = () => {
  const { collectionId } = useParams();
  const { getNftsMetadata, nftsMetadata } = useNfts(collectionId || '');
  const { theme } = useAccounts();

  useEffect(() => {
    if (collectionId) {
      getNftsMetadata();
    }
  }, [getNftsMetadata, collectionId]);

  return (
    <>
      <SContentBlockContainer>
        <NftsView nftsMetadata={nftsMetadata} />
      </SContentBlockContainer>
      <Stack direction='horizontal' gap={2} className='justify-content-end'>
        <Link to={routes.myAssets.nftMint(collectionId)}>
          <BasicButton>Mint NFT</BasicButton>
        </Link>
        <Link to='..'>
          <SSecondaryButton type='button' activeTheme={theme}>
            Back
          </SSecondaryButton>
        </Link>
      </Stack>
    </>
  );
};

export default memo(Nfts);
