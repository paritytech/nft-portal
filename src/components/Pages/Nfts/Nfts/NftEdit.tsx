import { FormEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Form, Stack } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import { saveImageToIpfs } from '@api/pinata.ts';

import ActionButton from '@buttons/ActionButton.tsx';

import FileDropZone from '@common/FileDropZone.tsx';
import ModalStatus from '@common/ModalStatus.tsx';

import { CollectionMetadataData } from '@helpers/interfaces.ts';

import { useNfts } from '@hooks/useNfts.ts';

const NftEdit = () => {
  const { collectionId, nftId } = useParams();
  const { getNftMetadata, saveNftMetadata, nftMetadata, isNftDataLoading } = useNfts(collectionId || '');
  const nftNameRef = useRef<HTMLInputElement>(null);
  const nftDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const [imageCid, setImageCid] = useState<string>();
  const [imageSourceUrl, setImageSourceUrl] = useState<string>();

  const submitMetadata = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (collectionId && nftId && nftNameRef.current) {
        const updatedMetadata: CollectionMetadataData = {
          name: nftNameRef.current.value,
          description: nftDescriptionRef.current ? nftDescriptionRef.current.value : undefined,
          image: imageCid,
        };

        saveImageToIpfs(imageSourceUrl);
        saveNftMetadata(nftId, updatedMetadata);
      }
    },
    [collectionId, nftId, saveNftMetadata, imageSourceUrl, imageCid],
  );

  useEffect(() => {
    setImageCid(nftMetadata?.image);
  }, [nftMetadata]);

  useEffect(() => {
    if (collectionId && nftId) {
      getNftMetadata(nftId);
    }
  }, [collectionId, nftId, getNftMetadata]);

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
          <Form.Label>
            Description <i>(optional)</i>:
          </Form.Label>
          <Form.Control as='textarea' rows={3} defaultValue={nftMetadata?.description} ref={nftDescriptionRef} />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>
            Image <i>(optional)</i>:
          </Form.Label>
          <FileDropZone
            imageSourceUrl={imageSourceUrl}
            setImageSourceUrl={setImageSourceUrl}
            imageCid={imageCid}
            setImageCid={setImageCid}
          />
        </Form.Group>

        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <ActionButton type='submit' className='main'>
            Submit metadata
          </ActionButton>
          <Link to='..'>
            <ActionButton type='button' className='secondary'>
              Back
            </ActionButton>
          </Link>
        </Stack>
      </Form>
    </>
  );
};

export default memo(NftEdit);
