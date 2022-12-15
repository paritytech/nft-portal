import { FormEvent, memo, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

import { CollectionMetadataData } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styles';
import { useCollections } from '@hooks/useCollections';
import BasicButton from '@buttons/BasicButton';

const NftCollectionEdit = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { getCollectionMetadata, saveCollectionMetadata, collectionMetadata, isCollectionDataLoading, isCollectionDataSaving } = useCollections();
  const collectionNameRef = useRef<HTMLInputElement>(null);
  const collectionDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const collectionImageRef = useRef<HTMLInputElement>(null);

  const submitMetadata = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (collectionId && collectionNameRef.current) {
        const updatedMetadata: CollectionMetadataData = {
          name: collectionNameRef.current.value,
          description: collectionDescriptionRef.current ? collectionDescriptionRef.current.value : undefined,
          image: collectionImageRef.current ? collectionImageRef.current.value : undefined,
        };

        saveCollectionMetadata(collectionId, updatedMetadata);
        // TODO need to add a status seeker, that will tell if save was a success or not and communicate that to the user
      }
    },
    [collectionId, saveCollectionMetadata],
  );

  useEffect(() => {
    if (collectionId) {
      getCollectionMetadata(collectionId);
    }
  }, [collectionId, getCollectionMetadata]);

  if (!collectionId) {
    navigate(routes.nftCollections);
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
          <Form.Label>Image ipfs hash:</Form.Label>
          <Form.Control type='text' defaultValue={collectionMetadata?.image} ref={collectionImageRef} />
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

export default memo(NftCollectionEdit);
