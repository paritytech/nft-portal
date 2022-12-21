import { FormEvent, useCallback, useRef, memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import styled from 'styled-components';

import { useNfts } from '@hooks/useNfts';
import { useStatus } from '@hooks/useStatus';
import BasicButton from '@buttons/BasicButton';
import { SSecondaryButton } from '@helpers/styles';
import { routes } from '@helpers/routes';

const SNftTaken = styled.div`
  margin-top: 5px;
`;

const NewNft = () => {
  const { collectionId } = useParams();
  const { mintNft, getNft, isNftDataSaving } = useNfts(collectionId || '');
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
        <BasicButton type='submit' isDisabled={isNftDataSaving}>
          {isNftDataSaving ? 'Minting NFT' : 'Mint NFT'}
        </BasicButton>
        <Link to={routes.nfts(collectionId)}>
          <SSecondaryButton type='button'>Back</SSecondaryButton>
        </Link>
      </Stack>
    </Form>
  );
};

export default memo(NewNft);
