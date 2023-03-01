import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import Stack from 'react-bootstrap/esm/Stack';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import BasicButton from '@buttons/BasicButton';

import ModalStatus from '@common/ModalStatus';

import { useAccounts } from '@contexts/AccountsContext';

import { StatusTypes } from '@helpers/constants';
import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';

import { useCheckMintingEligibility } from '@hooks/useCheckMintingEligibility';
import { useNfts } from '@hooks/useNfts';
import { useStatus } from '@hooks/useStatus';

const SNftTaken = styled.div`
  margin-top: 5px;
`;

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
          // TODO provide witness data or null, { owner_of_item: 'nft_id_here' }
          // this will also be changed soon to 'nftOwned'
          mintNft(nftId, nftReceiverRef.current.value, { owner_of_item: '%%%nft_id_from_another_collection%%%' });
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
            <SNftTaken className='text-danger'>{contextualStatusMessage.statusMessage}</SNftTaken>
          )}
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>NFT receiver:</Form.Label>
          <Form.Control ref={nftReceiverRef} defaultValue={activeAccount.address} />
        </Form.Group>
        {holderOfStatusMessage && holderOfStatusMessage.statusType === StatusTypes.MUST_BE_HOLDER_OF && (
          <SNftTaken className='text-danger'>{holderOfStatusMessage.statusMessage}</SNftTaken>
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
