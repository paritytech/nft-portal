import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import FormControl from 'react-bootstrap/esm/FormControl';
import FormSelect from 'react-bootstrap/esm/FormSelect';
import Stack from 'react-bootstrap/esm/Stack';
import { Link, useParams } from 'react-router-dom';

import { saveImageToIpfs } from '@api/pinata';

import ActionButton from '@buttons/ActionButton';

import FileDropZone from '@common/FileDropZone';
import ModalStatus from '@common/ModalStatus';
import ShowRestrictionMessage from '@common/ShowRestrictionMessage';

import { useAccounts } from '@contexts/AccountsContext';

import { RestrictionTypes } from '@helpers/constants';
import { CollectionMetadataData, MintAccessNft } from '@helpers/interfaces';
import { SFormBlock, SPageControls } from '@helpers/reusableStyles';
import { SFormLayout, SGroup, SLabel } from '@helpers/styledComponents';
import { generateAssetId } from '@helpers/utilities';

import { useCheckMintingEligibility } from '@hooks/useCheckMintingEligibility';
import { useNfts } from '@hooks/useNfts';

const MintNft = () => {
  const { collectionId } = useParams();
  const { mintNft } = useNfts(collectionId || '');
  const { activeAccount } = useAccounts();
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
  const [imageSourceUrl, setImageSourceUrl] = useState<string>();

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
      <SFormLayout onSubmit={submitMintNft}>
        <aside>
          <SGroup>
            <SLabel>
              Media <i>(optional)</i>
            </SLabel>
            <FileDropZone
              imageSourceUrl={imageSourceUrl}
              setImageSourceUrl={setImageSourceUrl}
              imageCid={imageCid}
              setImageCid={setImageCid}
            />
          </SGroup>
        </aside>

        <section>
          <SFormBlock>
            <SGroup>
              <SLabel>Name</SLabel>
              <FormControl type='text' ref={nftNameRef} placeholder='Enter NFT Name' required />
            </SGroup>

            <SGroup>
              <SLabel>Mint To</SLabel>
              <FormControl
                type='text'
                ref={nftReceiverRef}
                placeholder='Receiver Wallet'
                defaultValue={activeAccount.address}
              />
            </SGroup>

            <SGroup>
              <SLabel>
                Description <i>(optional)</i>
              </SLabel>
              <FormControl as='textarea' rows={3} ref={nftDescriptionRef} placeholder='Enter NFT Description' />
            </SGroup>

            {Array.isArray(ownedNftsFromAnotherCollection) && ownedNftsFromAnotherCollection.length > 0 && (
              <SGroup>
                <SLabel>Select which access NFT you want to use for the mint</SLabel>
                <FormSelect onChange={(event) => setMintAccessNft({ ownedItem: event.target.value })} required>
                  <option value=''>Select NFT</option>
                  {ownedNftsFromAnotherCollection.map((ownedNft) => (
                    <option key={ownedNft} value={ownedNft}>
                      {ownedNft}
                    </option>
                  ))}
                </FormSelect>
              </SGroup>
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
          </SFormBlock>

          <SPageControls>
            <Stack direction='horizontal' gap={3}>
              <ActionButton type='submit' isDisabled={!isEligibleToMint} className='main L w-50'>
                Mint NFT
              </ActionButton>

              <Link to='..' className='d-block w-50'>
                <ActionButton type='button' className='secondary L w-100'>
                  Back
                </ActionButton>
              </Link>
            </Stack>
          </SPageControls>
        </section>
      </SFormLayout>
    </>
  );
};

export default memo(MintNft);
