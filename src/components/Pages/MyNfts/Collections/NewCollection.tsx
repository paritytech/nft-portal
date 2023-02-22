import { FormEvent, memo, useCallback, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import BasicButton from '@buttons/BasicButton';

import ModalStatus from '@common/ModalStatus';

import { useAccounts } from '@contexts/AccountsContext';

import { MintTypes } from '@helpers/constants';
import { CollectionConfig } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';
import { convertToBitFlagValue } from '@helpers/utilities';

import { useCollections } from '@hooks/useCollections';

const SIndentation = styled.section`
  margin-left: 15px;
`;

const NewCollection = () => {
  const { api, theme } = useAccounts();
  const { mintCollection } = useCollections();
  const transferrableItemsRef = useRef<HTMLInputElement>(null);
  const unlockedMetadataRef = useRef<HTMLInputElement>(null);
  const unlockedAttributesRef = useRef<HTMLInputElement>(null);
  const unlockedMaxSupplyRef = useRef<HTMLInputElement>(null);
  const maxSupplyRef = useRef<HTMLInputElement>(null);
  const mintTypeRef = useRef<HTMLSelectElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const transferrableItemRef = useRef<HTMLInputElement>(null);
  const unlockedItemMetadataRef = useRef<HTMLInputElement>(null);
  const unlockedItemAttributesRef = useRef<HTMLInputElement>(null);

  const submitMintCollection = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      const collectionConfig: CollectionConfig = {};

      if (
        api !== null &&
        transferrableItemsRef.current !== null &&
        unlockedMetadataRef.current !== null &&
        unlockedAttributesRef.current !== null &&
        unlockedMaxSupplyRef.current !== null &&
        maxSupplyRef.current !== null &&
        mintTypeRef.current !== null &&
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

        // TODO get startBlock, endBlock with getBlockNumber()

        collectionConfig.settings = settings;
        collectionConfig.maxSupply = maxSupplyRef.current.value === '' ? undefined : parseInt(maxSupplyRef.current.value, 10);
        collectionConfig.mintSettings = {
          mintType: mintTypeRef.current.value as MintTypes,
          price: priceRef.current.value === '' ? undefined : parseFloat(priceRef.current.value) * 10 ** api.registry.chainDecimals[0],
          startBlock: undefined,
          endBlock: undefined,
          defaultItemSettings,
        };
      }

      mintCollection(collectionConfig);
    },
    [api, mintCollection],
  );

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
              <Form.Label>Max supply (optional):</Form.Label>
              <Form.Control type='number' ref={maxSupplyRef} />
            </Form.Group>
          </SIndentation>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label className='fs-4'>Mint settings</Form.Label>

          <SIndentation>
            <Form.Group className='mb-3'>
              <Form.Label>Mint type:</Form.Label>
              <Form.Select ref={mintTypeRef}>
                {Object.entries(MintTypes).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Price (optional):</Form.Label>
              <Form.Control
                type='text'
                ref={priceRef}
                pattern={`^(0|[1-9][0-9]*)(\.[0-9]{0,${api?.registry.chainDecimals[0]}})?$`}
                title={`Please enter a number e.g. 10.25, max precision is ${api?.registry.chainDecimals[0]} decimals after .`}
              />
            </Form.Group>

            {/* TODO add optional range picker */}

            <Form.Group className='mb-3'>
              <Form.Label>Default item settings:</Form.Label>
              <Form.Check type='checkbox' label='Transferrable' ref={transferrableItemRef} defaultChecked />
              <Form.Check type='checkbox' label='Unlocked metadata' ref={unlockedItemMetadataRef} defaultChecked />
              <Form.Check type='checkbox' label='Unlocked attributes' ref={unlockedItemAttributesRef} defaultChecked />
            </Form.Group>
          </SIndentation>
        </Form.Group>

        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <BasicButton type='submit'>Mint collection</BasicButton>
          <Link to={routes.collections}>
            <SSecondaryButton type='button' activeTheme={theme}>
              Back
            </SSecondaryButton>
          </Link>
        </Stack>
      </Form>
    </>
  );
};

export default memo(NewCollection);
