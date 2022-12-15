import { FormEvent, memo, useCallback, useEffect, useRef } from 'react';
import { Link, redirect, useParams } from 'react-router-dom';

import { CollectionMetadataData } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { useNfts } from '@hooks/useNfts';
import Form from 'react-bootstrap/esm/Form';
import Stack from 'react-bootstrap/esm/Stack';
import BasicButton from '@buttons/BasicButton';
import { SSecondaryButton } from '@helpers/styles';

const NftEdit = () => {
  const { collectionId, nftId } = useParams();
  const { getNftMetadata, saveNftMetadata, nftMetadata, isNftDataLoading, isNftDataSaving } = useNfts(collectionId || '');
  const nftNameRef = useRef<HTMLInputElement>(null);
  const nftDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const nftImageRef = useRef<HTMLInputElement>(null);

  const submitMetadata = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (collectionId && nftId && nftNameRef.current) {
        const updatedMetadata: CollectionMetadataData = {
          name: nftNameRef.current.value,
          description: nftDescriptionRef.current ? nftDescriptionRef.current.value : undefined,
          image: nftImageRef.current ? nftImageRef.current.value : undefined,
        };

        saveNftMetadata(nftId, updatedMetadata);
      }
    },
    [collectionId, nftId, saveNftMetadata],
  );

  useEffect(() => {
    if (collectionId && nftId) {
      getNftMetadata(nftId);
    }
  }, [collectionId, nftId, getNftMetadata]);

  if (!collectionId || !nftId) {
    redirect(routes.collections);
    return null;
  }

  if (isNftDataLoading) {
    return <>loading...</>;
  }

  return (
    <>
      <h2>NFT ID #{nftId} metadata:</h2>

      <Form onSubmit={submitMetadata}>
        <Form.Group className='mb-3'>
          <Form.Label>NFT name:</Form.Label>
          <Form.Control type='text' defaultValue={nftMetadata?.name} ref={nftNameRef} required />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Description:</Form.Label>
          <Form.Control as='textarea' rows={3} defaultValue={nftMetadata?.description} ref={nftDescriptionRef} />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Image ipfs hash:</Form.Label>
          <Form.Control type='text' defaultValue={nftMetadata?.image} ref={nftImageRef} />
        </Form.Group>
        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <BasicButton type='submit' isDisabled={isNftDataSaving}>
            Submit metadata
          </BasicButton>
          <Link to='..' relative='path'>
            <SSecondaryButton type='button'>Back</SSecondaryButton>
          </Link>
        </Stack>
      </Form>
    </>
  );
};

export default memo(NftEdit);
