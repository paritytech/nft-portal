import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import Stack from 'react-bootstrap/esm/Stack';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { saveImageToIpfs } from '@api/pinata';

import ActionButton from '@buttons/ActionButton';
import DateRangeButton from '@buttons/DateRangeButton';

import FileDropZone from '@common/FileDropZone';
import ModalStatus from '@common/ModalStatus';

import { useAccounts } from '@contexts/AccountsContext';

import { MintTypes } from '@helpers/constants';
import { CollectionConfig, CollectionMetadataData, MintType } from '@helpers/interfaces';
import { convertToBitFlagValue, ellipseAddress, getBlockNumber, pricePattern, unitToPlanck } from '@helpers/utilities';

import { useCollections } from '@hooks/useCollections';
import { SInput } from '@helpers/styledComponents';

const SFormLayout = styled(Form)`
  display: flex;
  gap: 56px;

  aside {
    width: 300px;
  }

  section {
    flex-grow: 1;
  }
`;

const SLabel = styled(Form.Label)`
  color: ${({ theme }) => theme.textAndIconsSecondary};
`;

const SInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  span:first-child {
    color: ${({ theme }) => theme.textAndIconsSecondary};
  }
`;

const CreateCollection = () => {
  const { api, activeAccount } = useAccounts();
  const { createCollection } = useCollections();
  const collectionNameRef = useRef<HTMLInputElement>(null);
  const collectionDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const transferrableItemsRef = useRef<HTMLInputElement | null>(null);
  const unlockedMetadataRef = useRef<HTMLInputElement | null>(null);
  const unlockedAttributesRef = useRef<HTMLInputElement | null>(null);
  const unlockedMaxSupplyRef = useRef<HTMLInputElement | null>(null);
  const maxSupplyRef = useRef<HTMLInputElement | null>(null);
  const transferrableItemRef = useRef<HTMLInputElement | null>(null);
  const unlockedItemMetadataRef = useRef<HTMLInputElement | null>(null);
  const unlockedItemAttributesRef = useRef<HTMLInputElement | null>(null);
  const holderOfCollectionIdRef = useRef<HTMLInputElement | null>(null);
  const [price, setPrice] = useState<string>('');
  const [imageCid, setImageCid] = useState<string>();
  const [imageSourceUrl, setImageSourceUrl] = useState<string>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [mintType, setMintType] = useState<MintTypes>(MintTypes.ISSUER);

  const submitCreateCollection = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (
        api !== null &&
        collectionNameRef.current !== null &&
        collectionDescriptionRef.current !== null &&
        transferrableItemsRef.current !== null &&
        unlockedMetadataRef.current !== null &&
        unlockedAttributesRef.current !== null &&
        unlockedMaxSupplyRef.current !== null &&
        maxSupplyRef.current !== null &&
        transferrableItemRef.current !== null &&
        unlockedItemMetadataRef.current !== null &&
        unlockedItemAttributesRef.current !== null
      ) {
        const settings = convertToBitFlagValue([
          transferrableItemsRef.current.checked,
          unlockedMetadataRef.current.checked,
          unlockedAttributesRef.current.checked,
          unlockedMaxSupplyRef.current.checked,
        ]);

        const defaultItemSettings = convertToBitFlagValue([
          transferrableItemRef.current.checked,
          unlockedItemMetadataRef.current.checked,
          unlockedItemAttributesRef.current.checked,
        ]);

        const startBlock = await getBlockNumber(api, startDate?.getTime());
        const endBlock = await getBlockNumber(api, endDate?.getTime());

        let mintTypeFinalized: MintType = mintType;
        if (mintType === MintTypes.HOLDER_OF) {
          if (holderOfCollectionIdRef.current === null) {
            return;
          }

          mintTypeFinalized = {
            [MintTypes.HOLDER_OF]: holderOfCollectionIdRef.current.value,
          };
        }

        const collectionConfig: CollectionConfig = {
          settings,
          maxSupply: maxSupplyRef.current.value === '' ? undefined : parseInt(maxSupplyRef.current.value, 10),
          mintSettings: {
            mintType: mintTypeFinalized,
            price:
              price === ''
                ? undefined
                : unitToPlanck(price, api.registry.chainDecimals[0]),
            startBlock,
            endBlock,
            defaultItemSettings,
          },
        };

        const collectionMetadata: CollectionMetadataData = {
          name: collectionNameRef.current.value,
          description: collectionDescriptionRef.current ? collectionDescriptionRef.current.value : undefined,
          image: imageCid,
        };

        Promise.all([saveImageToIpfs(imageSourceUrl), createCollection(collectionConfig, collectionMetadata)]);
      }
    },
    [api, startDate, endDate, mintType, price, imageCid, imageSourceUrl, createCollection],
  );

  if (!api) {
    return null;
  }

  const chainDecimals = api.registry.chainDecimals[0];

  return (
    <>
      <ModalStatus />
      <SFormLayout onSubmit={submitCreateCollection}>
        <aside>
          <Form.Group className='mb-3'>
            <SLabel>Media</SLabel>
            <FileDropZone
              imageSourceUrl={imageSourceUrl}
              setImageSourceUrl={setImageSourceUrl}
              imageCid={imageCid}
              setImageCid={setImageCid}
            />
          </Form.Group>

          <SInfoRow>
            <span>Collection Owner</span>
            <span>{ellipseAddress(activeAccount?.address)}</span>
          </SInfoRow>

          <SInfoRow>
            <span>Collection Mint Price</span>
            <span>{price || '0'} {api.registry.chainTokens}</span>
          </SInfoRow>
        </aside>
        <section>
          <Form.Group className='mb-3'>
            <SLabel>Collection name</SLabel>
            <SInput type='text' ref={collectionNameRef} required />
          </Form.Group>
          <Form.Group className='mb-3'>
            <SLabel>Description</SLabel>
            <Form.Control as='textarea' rows={3} ref={collectionDescriptionRef} />
          </Form.Group>

          <div>Collection settings</div>

          <Form.Group className='mb-3'>
            <Form.Check type='checkbox' label='Transferrable items' ref={transferrableItemsRef} defaultChecked />
            <Form.Check type='checkbox' label='Unlocked metadata' ref={unlockedMetadataRef} defaultChecked />
            <Form.Check type='checkbox' label='Unlocked attributes' ref={unlockedAttributesRef} defaultChecked />
            <Form.Check type='checkbox' label='Unlocked max supply' ref={unlockedMaxSupplyRef} defaultChecked />
          </Form.Group>

          <Form.Group className='mb-3'>
            <SLabel>
              Max supply <i>(optional)</i>:
            </SLabel>
            <Form.Control type='number' ref={maxSupplyRef} />
          </Form.Group>

          <div>Mint settings</div>

          <Form.Group className='mb-3'>
            <SLabel>Mint type:</SLabel>
            <Form.Select onChange={(event) => setMintType(event.target.value as MintTypes)} defaultValue={mintType}>
              {Object.entries(MintTypes).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </Form.Select>
            {mintType === MintTypes.HOLDER_OF && (
              <Form.Group className='mt-3'>
                <SLabel>Collection ID (must have a NFT from this collection)</SLabel>
                <Form.Control type='number' ref={holderOfCollectionIdRef} min={0} required />
              </Form.Group>
            )}
          </Form.Group>

          <Form.Group className='mb-3'>
            <SLabel>
              Price <i>(optional)</i>:
            </SLabel>
            <Form.Control
              type='text'
              pattern={pricePattern(chainDecimals)}
              title={`Please enter a number e.g. 10.25, max precision is ${chainDecimals} decimals after .`}
              onChange={event => setPrice(event.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <DateRangeButton
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <SLabel>Default item settings</SLabel>
            <Form.Check type='checkbox' label='Transferrable' ref={transferrableItemRef} defaultChecked />
            <Form.Check type='checkbox' label='Unlocked metadata' ref={unlockedItemMetadataRef} defaultChecked />
            <Form.Check type='checkbox' label='Unlocked attributes' ref={unlockedItemAttributesRef} defaultChecked />
          </Form.Group>

          <Stack direction='horizontal' gap={2} className='justify-content-end mb-6'>
            <ActionButton type='submit' className='main S'>
              Create collection
            </ActionButton>
            <Link to='..'>
              <ActionButton type='button' className='secondary S'>
                Back
              </ActionButton>
            </Link>
          </Stack>
        </section>
      </SFormLayout>
    </>
  );
};

export default memo(CreateCollection);
