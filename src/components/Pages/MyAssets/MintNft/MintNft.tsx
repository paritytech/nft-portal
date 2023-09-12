import { ChangeEvent, FormEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import { FormControl, Stack } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import { saveImageToIpfs } from '@api/pinata.ts';

import ActionButton from '@buttons/ActionButton.tsx';

import FileDropZone from '@common/FileDropZone.tsx';
import ModalStatus from '@common/ModalStatus.tsx';
import Radio from '@common/Radio.tsx';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { RestrictionTypes } from '@helpers/config.ts';
import { CollectionConfigJson, CollectionMetadataData, NftWitnessData } from '@helpers/interfaces.ts';
import {
  CssFontSemiBoldL,
  SAside,
  SFormBlock,
  SInfoRow,
  SInputWithIcon,
  SPageControls,
} from '@helpers/reusableStyles.ts';
import { SFormLayout, SGroup, SImageSelection, SLabel } from '@helpers/styledComponents.ts';
import { generateNftId, planckToUnit } from '@helpers/utilities.ts';

import { useCheckMintingEligibility } from '@hooks/useCheckMintingEligibility.ts';
import { useNfts } from '@hooks/useNfts.ts';
import { useQRCodeScanner } from '@hooks/useQRCodeScanner.ts';

import QRCodeIcon from '@images/icons/qr-code.svg';

import QRScannerModal from '@modals/QRScannerModal/QRScannerModal.tsx';

import ShowRestrictionMessage from './ShowRestrictionMessage.tsx';

const SMintPrice = styled.div`
  ${CssFontSemiBoldL}
`;

const MintNft = () => {
  const { collectionId } = useParams();
  const { mintNft } = useNfts(collectionId);
  const { api, activeAccount } = useAccounts();
  const {
    restrictionMessages,
    checkAvailabilityRestriction,
    isEligibleToMint,
    ownedNftsFromAnotherCollection,
    clearRestrictions,
  } = useCheckMintingEligibility(collectionId || '');
  const [nftWitnessData, setNftWitnessData] = useState<NftWitnessData>();
  const nftNameRef = useRef<HTMLInputElement>(null);
  const nftDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const nftReceiverRef = useRef<HTMLInputElement>(null);
  const [imageCid, setImageCid] = useState<string | undefined>();
  const [imageSourceUrl, setImageSourceUrl] = useState<string>();
  const { isQRCodeScannerOpen, handleShow, handleClose, handleScan } = useQRCodeScanner(nftReceiverRef);

  const submitMintNft = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      clearRestrictions();

      if (collectionId && nftNameRef.current !== null && nftReceiverRef.current !== null && nftWitnessData) {
        const nftId = generateNftId().toString();
        const isAvailable = await checkAvailabilityRestriction(nftId);

        const metadata: CollectionMetadataData = {
          name: nftNameRef.current.value,
          description: nftDescriptionRef.current ? nftDescriptionRef.current.value : undefined,
          image: imageCid,
        };

        if (isAvailable) {
          saveImageToIpfs(imageSourceUrl);
          mintNft(nftId, nftReceiverRef.current.value, metadata, nftWitnessData);
        }
      }
    },
    [clearRestrictions, collectionId, checkAvailabilityRestriction, imageCid, imageSourceUrl, mintNft, nftWitnessData],
  );

  useEffect(() => {
    const getPrice = async () => {
      if (api && collectionId) {
        const rawConfig = await api.query.nfts.collectionConfigOf(collectionId);

        if (rawConfig) {
          const jsonConfig = rawConfig.toJSON() as unknown as CollectionConfigJson;
          const price = jsonConfig.mintSettings.price !== null ? jsonConfig.mintSettings.price.toString() : undefined;

          setNftWitnessData((prevState) => ({ ...prevState, mintPrice: price }));
        }
      }
    };

    getPrice();
  }, [api, collectionId]);

  if (activeAccount === null) {
    return null;
  }

  return (
    <>
      <QRScannerModal isOpen={isQRCodeScannerOpen} onClose={handleClose} onScan={handleScan} />
      <ModalStatus />
      <SFormLayout onSubmit={submitMintNft}>
        <SAside>
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
        </SAside>

        <section>
          <SFormBlock>
            <SGroup>
              <SLabel>Name</SLabel>
              <FormControl type='text' ref={nftNameRef} placeholder='Enter NFT Name' required />
            </SGroup>

            <SGroup>
              <SLabel>
                <span>Mint To</span>
              </SLabel>
              <SInputWithIcon>
                <FormControl
                  type='text'
                  ref={nftReceiverRef}
                  placeholder='Receiver account'
                  defaultValue={activeAccount.address}
                  required
                />
                <QRCodeIcon onClick={handleShow} />
              </SInputWithIcon>
            </SGroup>

            <SGroup>
              <SLabel>
                Description <i>(optional)</i>
              </SLabel>
              <FormControl as='textarea' rows={3} ref={nftDescriptionRef} placeholder='Enter NFT Description' />
            </SGroup>

            <SImageSelection>
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
            </SImageSelection>

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
                      setNftWitnessData((prevState) => ({
                        ...prevState,
                        ownedItem: event.target.value,
                      }))
                    }
                    selectedValue={nftWitnessData?.ownedItem || ''}
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

          {nftWitnessData?.mintPrice && nftWitnessData.mintPrice !== '0' && api && (
            <SInfoRow>
              <span>Mint Price</span>
              <SMintPrice>{planckToUnit(nftWitnessData.mintPrice, api, true)}</SMintPrice>
            </SInfoRow>
          )}

          <SPageControls>
            <Stack direction='horizontal' gap={3}>
              <Link to='..' className='w-25'>
                <ActionButton type='button' className='stroke w-100'>
                  Back
                </ActionButton>
              </Link>
              <ActionButton type='submit' disabled={!isEligibleToMint} className='main w-75'>
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
