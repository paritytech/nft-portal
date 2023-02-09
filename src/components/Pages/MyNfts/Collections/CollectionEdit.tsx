import { FormEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { saveImageToIpfs } from '@api/pinata';

import BasicButton from '@buttons/BasicButton';

import FileDropZone from '@common/FileDropZone';
import ModalStatus from '@common/ModalStatus';

import { useAccounts } from '@contexts/AccountsContext';

import { CollectionMetadataData } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';

import { useCollections } from '@hooks/useCollections';

const CollectionEdit = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { theme } = useAccounts();
  const { getCollectionMetadata, saveCollectionMetadata, collectionMetadata, isCollectionDataLoading } = useCollections();
  const collectionNameRef = useRef<HTMLInputElement>(null);
  const collectionDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const [imageCid, setImageCid] = useState<string | undefined>();
  const [imageSourceUrl, setImageSourceUrl] = useState<string | null>(null);

  const submitMetadata = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (collectionId && collectionNameRef.current) {
        const updatedMetadata: CollectionMetadataData = {
          name: collectionNameRef.current.value,
          description: collectionDescriptionRef.current ? collectionDescriptionRef.current.value : undefined,
          image: imageCid ?? undefined,
        };

        Promise.all([saveImageToIpfs(imageSourceUrl), saveCollectionMetadata(collectionId, updatedMetadata)]);
      }
    },
    [collectionId, saveCollectionMetadata, imageSourceUrl, imageCid],
  );

  useEffect(() => {
    setImageCid(collectionMetadata?.image);
  }, [collectionMetadata]);

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
      <ModalStatus />
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
          <FileDropZone imageSourceUrl={imageSourceUrl} setImageSourceUrl={setImageSourceUrl} imageCid={imageCid} setImageCid={setImageCid} />
        </Form.Group>
        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <BasicButton type='submit'>Submit metadata</BasicButton>
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

export default memo(CollectionEdit);
