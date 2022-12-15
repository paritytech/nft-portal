import { FormEvent, useCallback, useRef, memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

import { useNfts } from '@hooks/useNfts';
import BasicButton from '@buttons/BasicButton';
import { SSecondaryButton } from '@helpers/styles';
import { routes } from '@helpers/routes';

const NewNft = () => {
  const { collectionId } = useParams();
  const { mintNft, isNftDataSaving } = useNfts(collectionId || '');
  const nftIdRef = useRef<HTMLInputElement>(null);

  const submitMintNft = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (collectionId && nftIdRef.current) {
        mintNft(nftIdRef.current.value);
      }
    },
    [collectionId, mintNft],
  );

  return (
    <Form onSubmit={submitMintNft}>
      <Form.Group className='mb-3'>
        <Form.Label>Collection ID:</Form.Label>
        <Form.Control type='text' defaultValue={collectionId} disabled />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>NFT ID:</Form.Label>
        <Form.Control type='text' ref={nftIdRef} required />
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
