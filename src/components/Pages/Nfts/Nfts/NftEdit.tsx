import { FormEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import Stack from 'react-bootstrap/esm/Stack';
import { Link, useParams } from 'react-router-dom';

import { saveImageToIpfs } from '@api/pinata';

import BasicButton from '@buttons/BasicButton';

import FileDropZone from '@common/FileDropZone';
import ModalStatus from '@common/ModalStatus';

import { useAccounts } from '@contexts/AccountsContext';

import { CollectionMetadataData } from '@helpers/interfaces';
import { SSecondaryButton } from '@helpers/styledComponents';

import { useNfts } from '@hooks/useNfts';

const NftEdit = () => {
  const { collectionId, nftId } = useParams();
  const { getNftMetadata, saveNftMetadata, nftMetadata, isNftDataLoading } = useNfts(collectionId || '');
  const { theme } = useAccounts();
  const nftNameRef = useRef<HTMLInputElement>(null);
  const nftDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const [imageCid, setImageCid] = useState<string | undefined>();
  const [imageSourceUrl, setImageSourceUrl] = useState<string | null>(null);

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

export default memo(NftEdit);
