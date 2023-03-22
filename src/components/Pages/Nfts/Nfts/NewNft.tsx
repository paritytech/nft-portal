import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import Stack from 'react-bootstrap/esm/Stack';
import { Link, useParams } from 'react-router-dom';

import { saveImageToIpfs } from '@api/pinata';

import BasicButton from '@buttons/BasicButton';

import FileDropZone from '@common/FileDropZone';
import ModalStatus from '@common/ModalStatus';
import ShowRestrictionMessage from '@common/ShowRestrictionMessage';

import { useAccounts } from '@contexts/AccountsContext';

import { RestrictionTypes } from '@helpers/constants';
import { CollectionMetadataData, MintAccessNft } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';
import { generateAssetId } from '@helpers/utilities';

import { useCheckMintingEligibility } from '@hooks/useCheckMintingEligibility';
import { useNfts } from '@hooks/useNfts';

const NewNft = () => {
  const { collectionId } = useParams();
  const { mintNft } = useNfts(collectionId || '');
  const { activeAccount, theme } = useAccounts();
  const {
    restrictionMessages,
    checkAvailabilityRestriction,
    isEligibleToMint,
    ownedNftsFromAnotherCollection,
    clearRestrictions,
  } = useCheckMintingEligibility(collectionId || '');
  const [mintAccessNft, setMintAccessNft] = useState<MintAccessNft | null>(null);
  const nftNameRef = useRef<HTMLInputElement>(null);
  const nftDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const nftReceiverRef = useRef<HTMLInputElement>(null);
  const [imageCid, setImageCid] = useState<string | undefined>();
  const [imageSourceUrl, setImageSourceUrl] = useState<string | null>(null);

  const submitMintNft = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      clearRestrictions();

      if (collectionId && nftNameRef.current !== null && nftReceiverRef.current !== null) {
        const nftId = generateAssetId().toString();
        const isAvailable = await checkAvailabilityRestriction(nftId);

        const metadata: CollectionMetadataData = {
          name: nftNameRef.current.value,
          description: nftDescriptionRef.current ? nftDescriptionRef.current.value : undefined,
          image: imageCid,
        };

        if (isAvailable) {
          saveImageToIpfs(imageSourceUrl);
          mintNft(nftId, nftReceiverRef.current.value, mintAccessNft, metadata);
        }
      }
    },
    [clearRestrictions, collectionId, checkAvailabilityRestriction, imageCid, imageSourceUrl, mintNft, mintAccessNft],
  );

  if (activeAccount === null) {
    return null;
  }

  return (
    <>
      <ModalStatus />
      <Form onSubmit={submitMintNft}>
        <Form.Group className='mb-3'>
          <Form.Label>NFT name:</Form.Label>
          <Form.Control type='text' ref={nftNameRef} required />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>NFT receiver:</Form.Label>
          <Form.Control ref={nftReceiverRef} defaultValue={activeAccount.address} />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>
            Description <i>(optional)</i>:
          </Form.Label>
          <Form.Control as='textarea' rows={3} ref={nftDescriptionRef} />
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

        {Array.isArray(ownedNftsFromAnotherCollection) && ownedNftsFromAnotherCollection.length > 0 && (
          <Form.Group className='mb-3'>
            <Form.Label>Select which access NFT you want to use for the mint:</Form.Label>
            <Form.Select onChange={(event) => setMintAccessNft({ ownedItem: event.target.value })} required>
              <option value=''>Select NFT</option>
              {ownedNftsFromAnotherCollection.map((ownedNft) => (
                <option key={ownedNft} value={ownedNft}>
                  {ownedNft}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        <ShowRestrictionMessage
          restrictionsMessages={restrictionMessages}
          restrictionType={RestrictionTypes.MUST_BE_HOLDER_OF}
        />
        <ShowRestrictionMessage
          restrictionsMessages={restrictionMessages}
          restrictionType={RestrictionTypes.ALL_NFTS_MINTED}
        />
        <ShowRestrictionMessage
          restrictionsMessages={restrictionMessages}
          restrictionType={RestrictionTypes.NFT_TAKEN}
        />

        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <BasicButton type='submit' isDisabled={!isEligibleToMint}>
            Mint NFT
          </BasicButton>
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
