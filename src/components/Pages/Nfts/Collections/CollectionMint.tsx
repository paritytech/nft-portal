import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import Form from 'react-bootstrap/esm/Form';
import Stack from 'react-bootstrap/esm/Stack';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';
import DateRangeButton from '@buttons/DateRangeButton';

import ModalStatus from '@common/ModalStatus';

import { useAccounts } from '@contexts/AccountsContext';

import { MintTypes } from '@helpers/constants';
import { CollectionConfig, MintType } from '@helpers/interfaces';
import { convertToBitFlagValue, getBlockNumber, pricePattern, unitToPlanck } from '@helpers/utilities';

import { useCollections } from '@hooks/useCollections';

const SIndentation = styled.section`
  margin-left: 15px;
`;

const CollectionMint = () => {
  const { api } = useAccounts();
  const { mintCollection } = useCollections();
  const transferrableItemsRef = useRef<HTMLInputElement | null>(null);
  const unlockedMetadataRef = useRef<HTMLInputElement | null>(null);
  const unlockedAttributesRef = useRef<HTMLInputElement | null>(null);
  const unlockedMaxSupplyRef = useRef<HTMLInputElement | null>(null);
  const maxSupplyRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const transferrableItemRef = useRef<HTMLInputElement | null>(null);
  const unlockedItemMetadataRef = useRef<HTMLInputElement | null>(null);
  const unlockedItemAttributesRef = useRef<HTMLInputElement | null>(null);
  const holderOfCollectionIdRef = useRef<HTMLInputElement | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [mintType, setMintType] = useState<MintTypes>(MintTypes.ISSUER);

  const submitMintCollection = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const collectionConfig = {} as CollectionConfig;

      let mintTypeFinalized: MintType = mintType;
      if (mintType === MintTypes.HOLDER_OF) {
        if (holderOfCollectionIdRef.current === null) {
          return;
        }

        mintTypeFinalized = {
          [MintTypes.HOLDER_OF]: holderOfCollectionIdRef.current.value,
        };
      }

      if (
        api !== null &&
        transferrableItemsRef.current !== null &&
        unlockedMetadataRef.current !== null &&
        unlockedAttributesRef.current !== null &&
        unlockedMaxSupplyRef.current !== null &&
        maxSupplyRef.current !== null &&
        priceRef.current !== null &&
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

        collectionConfig.settings = settings;
        collectionConfig.maxSupply =
          maxSupplyRef.current.value === '' ? undefined : parseInt(maxSupplyRef.current.value, 10);
        collectionConfig.mintSettings = {
          mintType: mintTypeFinalized,
          price:
            priceRef.current.value === ''
              ? undefined
              : unitToPlanck(priceRef.current.value, api.registry.chainDecimals[0]),
          startBlock,
          endBlock,
          defaultItemSettings,
        };
      }

      mintCollection(collectionConfig);
    },
    [api, mintCollection, startDate, endDate, mintType],
  );

  if (!api) {
    return null;
  }

  const chainDecimals = api.registry.chainDecimals[0];

  return (
    <>
      <ModalStatus />
      <Form onSubmit={submitMintCollection}>
        <Form.Label className='fs-4'>Collection settings</Form.Label>

        <Form.Group className='mb-3'>
          <SIndentation>
            <Form.Group className='mb-3'>
              <Form.Check type='checkbox' label='Transferrable items' ref={transferrableItemsRef} defaultChecked />
              <Form.Check type='checkbox' label='Unlocked metadata' ref={unlockedMetadataRef} defaultChecked />
              <Form.Check type='checkbox' label='Unlocked attributes' ref={unlockedAttributesRef} defaultChecked />
              <Form.Check type='checkbox' label='Unlocked max supply' ref={unlockedMaxSupplyRef} defaultChecked />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>
                Max supply <i>(optional)</i>:
              </Form.Label>
              <Form.Control type='number' ref={maxSupplyRef} />
            </Form.Group>
          </SIndentation>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label className='fs-4'>Mint settings</Form.Label>

          <SIndentation>
            <Form.Group className='mb-3'>
              <Form.Label>Mint type:</Form.Label>
              <Form.Select onChange={(event) => setMintType(event.target.value as MintTypes)} defaultValue={mintType}>
                {Object.entries(MintTypes).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </Form.Select>
              {mintType === MintTypes.HOLDER_OF && (
                <Form.Group className='mt-3'>
                  <Form.Label>Collection ID (must have a NFT from this collection)</Form.Label>
                  <Form.Control type='number' ref={holderOfCollectionIdRef} min={0} required />
                </Form.Group>
              )}
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>
                Price <i>(optional)</i>:
              </Form.Label>
              <Form.Control
                type='text'
                ref={priceRef}
                pattern={pricePattern(chainDecimals)}
                title={`Please enter a number e.g. 10.25, max precision is ${chainDecimals} decimals after .`}
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
              <Form.Label>Default item settings:</Form.Label>
              <Form.Check type='checkbox' label='Transferrable' ref={transferrableItemRef} defaultChecked />
              <Form.Check type='checkbox' label='Unlocked metadata' ref={unlockedItemMetadataRef} defaultChecked />
              <Form.Check type='checkbox' label='Unlocked attributes' ref={unlockedItemAttributesRef} defaultChecked />
            </Form.Group>
          </SIndentation>
        </Form.Group>

        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <ActionButton type='submit' className='main S'>
            Mint collection
          </ActionButton>
          <Link to='..'>
            <ActionButton type='button' className='secondary S'>
              Back
            </ActionButton>
          </Link>
        </Stack>
      </Form>
    </>
  );
};

export default memo(CollectionMint);
