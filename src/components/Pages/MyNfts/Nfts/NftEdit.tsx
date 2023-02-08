import { ChangeEvent, FormEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import Stack from 'react-bootstrap/esm/Stack';
import { Link, redirect, useParams } from 'react-router-dom';

import { saveImageToIpfs } from '@api/pinata';

import BasicButton from '@buttons/BasicButton';

import ImagePreview from '@common/ImagePreview';

import { useAccounts } from '@contexts/AccountsContext';

import { CollectionMetadataData } from '@helpers/interfaces';
import { prefecthCid } from '@helpers/prefetchCid';
import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';

import { useNfts } from '@hooks/useNfts';
import ModalStatus from '@common/ModalStatus';

const NftEdit = () => {
  const { collectionId, nftId } = useParams();
  const { getNftMetadata, saveNftMetadata, nftMetadata, isNftDataLoading } = useNfts(collectionId || '');
  const { theme } = useAccounts();
  const nftNameRef = useRef<HTMLInputElement>(null);
  const nftDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const nftImageCidRef = useRef<HTMLInputElement>(null);
  const [imageSourceUrl, setImageSourceUrl] = useState<string | null>(null);

  const submitMetadata = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (collectionId && nftId && nftNameRef.current) {
        const updatedMetadata: CollectionMetadataData = {
          name: nftNameRef.current.value,
          description: nftDescriptionRef.current ? nftDescriptionRef.current.value : undefined,
          image: nftImageCidRef.current ? nftImageCidRef.current.value : undefined,
        };

        Promise.all([saveImageToIpfs(imageSourceUrl), saveNftMetadata(nftId, updatedMetadata)]);
      }
    },
    [collectionId, nftId, saveNftMetadata, imageSourceUrl],
  );

  const onImageChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    // TODO any restrictions on extensions and size?
    if (event.target.files && nftImageCidRef.current) {
      const { cid, url } = await prefecthCid(event.target.files[0]);
      nftImageCidRef.current.value = cid;

      setImageSourceUrl(url);
    }
  }, []);

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
      <ModalStatus />
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
          <Form.Label>Image:</Form.Label>
          <Form.Control type='file' onChange={onImageChange} className='mb-1' />
          <Form.Control type='text' defaultValue={nftMetadata?.image} ref={nftImageCidRef} className='mb-1' required readOnly />
          <ImagePreview imageCid={nftMetadata?.image} imageSourceUrl={imageSourceUrl} />
        </Form.Group>
        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <BasicButton type='submit'>
            Submit metadata
          </BasicButton>
          <Link to='..' relative='path'>
            <SSecondaryButton type='button' activeTheme={theme}>
              Back
            </SSecondaryButton>
          </Link>
        </Stack>
      </Form>
    </>
  );
};

export default memo(NftEdit);
