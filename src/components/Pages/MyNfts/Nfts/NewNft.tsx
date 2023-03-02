import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import Stack from 'react-bootstrap/esm/Stack';
import { Link, useParams } from 'react-router-dom';

import BasicButton from '@buttons/BasicButton';

import ModalStatus from '@common/ModalStatus';

import { useAccounts } from '@contexts/AccountsContext';

import { StatusTypes } from '@helpers/constants';
import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';

import { useCheckMintingEligibility } from '@hooks/useCheckMintingEligibility';
import { useNfts } from '@hooks/useNfts';
import { useStatus } from '@hooks/useStatus';

const NewNft = () => {
  const { collectionId } = useParams();
  const { mintNft, getNft } = useNfts(collectionId || '');
  const { activeAccount, theme } = useAccounts();
  const { nftTaken, contextualStatusMessage, clearStatus } = useStatus();
  const { holderOfStatusMessage, isEligibleToMint, ownedNftsFromAnotherCollection } = useCheckMintingEligibility(collectionId || '');
  const [mintAccessNft, setMintAccessNft] = useState<string | null>(null);
  const nftIdRef = useRef<HTMLInputElement>(null);
  const nftReceiverRef = useRef<HTMLInputElement>(null);

  const submitMintNft = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      clearStatus();

      if (collectionId && nftIdRef.current !== null && nftReceiverRef.current !== null) {
        const nftId = nftIdRef.current.value;
        const nft = await getNft(nftId);

        if (nft === null) {
          // TODO this will also be changed soon to 'nftOwned'
          mintNft(nftId, nftReceiverRef.current.value, { owner_of_item: mintAccessNft });
        } else {
          nftTaken(nftId);
        }
      }
    },
    [collectionId, mintNft, getNft, nftTaken, clearStatus, mintAccessNft],
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
          {contextualStatusMessage && contextualStatusMessage.statusType === StatusTypes.NFT_TAKEN && (
            <p className='text-danger mt-1'>{contextualStatusMessage.statusMessage}</p>
          )}
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>NFT receiver:</Form.Label>
          <Form.Control ref={nftReceiverRef} defaultValue={activeAccount.address} />
        </Form.Group>

        {Array.isArray(ownedNftsFromAnotherCollection) && ownedNftsFromAnotherCollection.length > 0 && (
          <Form.Group className='mb-3'>
            <Form.Label>Select which access NFT you want to use for the mint:</Form.Label>
            <Form.Select onChange={(event) => setMintAccessNft(event.target.value)}>
              {ownedNftsFromAnotherCollection.map((ownedNft) => (
                <option key={ownedNft} value={ownedNft}>
                  {ownedNft}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        {holderOfStatusMessage && holderOfStatusMessage.statusType === StatusTypes.MUST_BE_HOLDER_OF && (
          <p className='text-danger mb-3'>{holderOfStatusMessage.statusMessage}</p>
        )}

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
