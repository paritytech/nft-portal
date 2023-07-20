import { BN } from '@polkadot/util';
import { ChangeEvent, FormEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import { FormControl, Stack } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import { saveImageToIpfs } from '@api/pinata.ts';

import ActionButton from '@buttons/ActionButton.tsx';

import FileDropZone from '@common/FileDropZone.tsx';
import ModalStatus from '@common/ModalStatus.tsx';
import Radio from '@common/Radio.tsx';
import ShowRestrictionMessage from '@common/ShowRestrictionMessage.tsx';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { RestrictionTypes } from '@helpers/constants.ts';
import { CollectionConfigJson, CollectionMetadataData, MintAccessNft } from '@helpers/interfaces.ts';
import { SFormBlock, SInfoRow, SPageControls } from '@helpers/reusableStyles.ts';
import { SFormLayout, SGroup, SLabel } from '@helpers/styledComponents.ts';
import { generateNftId, getCleanFormattedBalance } from '@helpers/utilities.ts';

import { useCheckMintingEligibility } from '@hooks/useCheckMintingEligibility.ts';
import { useCollections } from '@hooks/useCollections.ts';
import { useNfts } from '@hooks/useNfts.ts';

const MintNft = () => {
  const { collectionId } = useParams();
  const { getCollectionConfig } = useCollections();
  const { mintNft } = useNfts(collectionId || '');
  const { api, activeAccount } = useAccounts();
  const {
    restrictionMessages,
    checkAvailabilityRestriction,
    isEligibleToMint,
    ownedNftsFromAnotherCollection,
    clearRestrictions,
  } = useCheckMintingEligibility(collectionId || '');
  const [mintAccessNft, setMintAccessNft] = useState<MintAccessNft>();
  const nftNameRef = useRef<HTMLInputElement>(null);
  const nftDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const nftReceiverRef = useRef<HTMLInputElement>(null);
  const [imageCid, setImageCid] = useState<string | undefined>();
  const [imageSourceUrl, setImageSourceUrl] = useState<string>();
  const [mintPrice, setMintPrice] = useState<string>();

  const submitMintNft = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      clearRestrictions();

      if (collectionId && nftNameRef.current !== null && nftReceiverRef.current !== null) {
        const nftId = generateNftId().toString();
        const isAvailable = await checkAvailabilityRestriction(nftId);

        const metadata: CollectionMetadataData = {
          name: nftNameRef.current.value,
          description: nftDescriptionRef.current ? nftDescriptionRef.current.value : undefined,
          image: imageCid,
        };

        if (isAvailable) {
          saveImageToIpfs(imageSourceUrl);
          mintNft(nftId, nftReceiverRef.current.value, metadata, mintAccessNft);
        }
      }
    },
    [clearRestrictions, collectionId, checkAvailabilityRestriction, imageCid, imageSourceUrl, mintNft, mintAccessNft],
  );

  useEffect(() => {
    const getPrice = async () => {
      if (api && collectionId) {
        const rawConfig = await getCollectionConfig(collectionId);

        if (rawConfig) {
          const jsonConfig = rawConfig.toJSON() as unknown as CollectionConfigJson;
          const price = getCleanFormattedBalance(
            new BN(jsonConfig.mintSettings.price || '0'),
            api.registry.chainDecimals[0],
          );

          setMintPrice(price);
        }
      }
    };

    getPrice();
  }, [api, collectionId, getCollectionConfig]);

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
                <SLabel>Select which NFT you want to use for the mint access</SLabel>
                {ownedNftsFromAnotherCollection.map((ownedNft) => (
                  <Radio
                    key={ownedNft}
                    name='mint-access'
                    label={ownedNft}
                    value={ownedNft}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setMintAccessNft({ ownedItem: event.target.value })
                    }
                    selectedValue={mintAccessNft?.ownedItem || ''}
                    required
                  />
                ))}
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

          <SInfoRow>
            <span>Mint Price</span>
            <span>
              {mintPrice} {api?.registry.chainTokens[0]}
            </span>
          </SInfoRow>

          <SPageControls>
            <Stack direction='horizontal' gap={3}>
              <Link to='..' className='w-50'>
                <ActionButton type='button' className='stroke w-100'>
                  Back
                </ActionButton>
              </Link>

              <ActionButton type='submit' disabled={!isEligibleToMint} className='secondary w-50'>
                Create NFT
              </ActionButton>
            </Stack>
          </SPageControls>
        </section>
      </SFormLayout>
    </>
  );
};

export default memo(MintNft);
