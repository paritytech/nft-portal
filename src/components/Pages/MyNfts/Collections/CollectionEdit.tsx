import { ChangeEvent, FormEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { saveImageToIpfs } from '@api/pinata';

import BasicButton from '@buttons/BasicButton';

import ImagePreview from '@common/ImagePreview';

import { CollectionMetadataData } from '@helpers/interfaces';
import { prefecthCid } from '@helpers/prefetchCid';
import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styles';

import { useCollections } from '@hooks/useCollections';

const CollectionEdit = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { getCollectionMetadata, saveCollectionMetadata, collectionMetadata, isCollectionDataLoading, isCollectionDataSaving } = useCollections();
  const collectionNameRef = useRef<HTMLInputElement>(null);
  const collectionDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const collectionImageCidRef = useRef<HTMLInputElement>(null);
  const [imageSourceUrl, setImageSourceUrl] = useState<string | null>(null);

  const submitMetadata = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (collectionId && collectionNameRef.current) {
        const updatedMetadata: CollectionMetadataData = {
          name: collectionNameRef.current.value,
          description: collectionDescriptionRef.current ? collectionDescriptionRef.current.value : undefined,
          image: collectionImageCidRef.current ? collectionImageCidRef.current.value : undefined,
        };

        Promise.all([saveImageToIpfs(imageSourceUrl), saveCollectionMetadata(collectionId, updatedMetadata)]);

        // TODO notify user that everything went well
      }
    },
    [collectionId, saveCollectionMetadata, imageSourceUrl],
  );

  const onImageChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    // TODO any restrictions on extensions and size?
    if (event.target.files && collectionImageCidRef.current) {
      const { cid, url } = await prefecthCid(event.target.files[0]);
      collectionImageCidRef.current.value = cid;

      setImageSourceUrl(url);
    }
  }, []);

  useEffect(() => {
    if (collectionId) {
      getCollectionMetadata(collectionId);
    }
  }, [collectionId, getCollectionMetadata]);

  useEffect(() => {
    if (imageSourceUrl) {
      return () => URL.revokeObjectURL(imageSourceUrl);
    }
  }, [imageSourceUrl]);

  if (!collectionId) {
    navigate(routes.collections);
  }

  if (isCollectionDataLoading) {
    return <>Gathering data... please wait</>;
  }

  return (
    <>
      <h2>NFT collection ID #{collectionId} metadata:</h2>

      <Form onSubmit={submitMetadata}>
        <Form.Group className='mb-3'>
          <Form.Label>Collection name:</Form.Label>
          <Form.Control type='text' defaultValue={collectionMetadata?.name} ref={collectionNameRef} required />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Description:</Form.Label>
          <Form.Control as='textarea' rows={3} defaultValue={collectionMetadata?.description} ref={collectionDescriptionRef} />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Image:</Form.Label>
          <Form.Control type='file' onChange={onImageChange} className='mb-1' />
          <Form.Control type='text' defaultValue={collectionMetadata?.image} ref={collectionImageCidRef} className='mb-1' required readOnly />
          <ImagePreview imageCid={collectionMetadata?.image} imageSourceUrl={imageSourceUrl} />
        </Form.Group>
        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <BasicButton type='submit' isDisabled={isCollectionDataSaving}>
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

export default memo(CollectionEdit);
