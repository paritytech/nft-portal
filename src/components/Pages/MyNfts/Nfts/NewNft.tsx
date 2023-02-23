import { FormEvent, memo, useCallback, useRef } from 'react';
import Form from 'react-bootstrap/esm/Form';
import Stack from 'react-bootstrap/esm/Stack';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import BasicButton from '@buttons/BasicButton';

import ModalStatus from '@common/ModalStatus';

import { useAccounts } from '@contexts/AccountsContext';

import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';

import { useNfts } from '@hooks/useNfts';
import { useStatus } from '@hooks/useStatus';

const SNftTaken = styled.div`
  margin-top: 5px;
`;

const NewNft = () => {
  const { collectionId } = useParams();
  const { mintNft, getNft } = useNfts(collectionId || '');
  const { theme } = useAccounts();
  const { nftTaken, statusMessage, clearStatus } = useStatus();
  const nftIdRef = useRef<HTMLInputElement>(null);

  const submitMintNft = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      clearStatus();

      if (collectionId && nftIdRef.current) {
        const nftId = nftIdRef.current.value;
        const nft = await getNft(nftId);

        if (nft === null) {
          mintNft(nftId);
        } else {
          nftTaken(nftId);
        }
      }
    },
    [collectionId, mintNft, getNft, nftTaken, clearStatus],
  );

  return (
    <>
      <ModalStatus />
      <Form onSubmit={submitMintNft}>
        <Form.Group className='mb-3'>
          <Form.Label>Collection ID:</Form.Label>
          <Form.Control type='text' defaultValue={collectionId} disabled />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>NFT ID:</Form.Label>
          <Form.Control type='number' ref={nftIdRef} required />
          {statusMessage && <SNftTaken className='text-danger'>{statusMessage}</SNftTaken>}
        </Form.Group>
        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <BasicButton type='submit'>Mint NFT</BasicButton>
          <Link to={routes.nfts(collectionId)}>
            <SSecondaryButton type='button' activeTheme={theme}>
              Back
            </SSecondaryButton>
          </Link>
        </Stack>
      </Form>
    </>
  );
};

export default memo(NewNft);
