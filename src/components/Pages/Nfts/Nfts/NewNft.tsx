import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import Stack from 'react-bootstrap/esm/Stack';
import { Link, useParams } from 'react-router-dom';

import BasicButton from '@buttons/BasicButton';

import ModalStatus from '@common/ModalStatus';
import ShowRestrictionMessage from '@common/ShowRestrictionMessage';

import { useAccounts } from '@contexts/AccountsContext';

import { RestrictionTypes } from '@helpers/constants';
import { MintAccessNft } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';

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
  const nftIdRef = useRef<HTMLInputElement>(null);
  const nftReceiverRef = useRef<HTMLInputElement>(null);

  const submitMintNft = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      clearRestrictions();

      if (collectionId && nftIdRef.current !== null && nftReceiverRef.current !== null) {
        const nftId = nftIdRef.current.value;
        const isAvailable = await checkAvailabilityRestriction(nftId);

        if (isAvailable) {
          mintNft(nftId, nftReceiverRef.current.value, mintAccessNft);
        }
      }
    },
    [collectionId, mintNft, clearRestrictions, mintAccessNft, checkAvailabilityRestriction],
  );

  if (activeAccount === null) {
    return null;
  }

  return (
    <>
      <ModalStatus />
      <Form onSubmit={submitMintNft}>
        <Form.Group className='mb-3'>
          <Form.Label>Collection ID:</Form.Label>
          <Form.Control type='text' defaultValue={collectionId} disabled />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>NFT ID:</Form.Label>
          <Form.Control type='number' ref={nftIdRef} required />
          <ShowRestrictionMessage
            restrictionsMessages={restrictionMessages}
            restrictionType={RestrictionTypes.NFT_TAKEN}
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>NFT receiver:</Form.Label>
          <Form.Control ref={nftReceiverRef} defaultValue={activeAccount.address} />
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
