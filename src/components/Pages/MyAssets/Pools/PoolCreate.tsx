import { formatBalance } from '@polkadot/util';
import type { ToBn } from '@polkadot/util/types';
import { FormEvent, memo, useCallback, useEffect, useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/esm/Form';
import { Link } from 'react-router-dom';

import BasicButton from '@buttons/BasicButton';

import ModalStatus from '@common/ModalStatus';
import Title from '@common/Title';

import { useAccounts } from '@contexts/AccountsContext';

import { SSecondaryButton } from '@helpers/styledComponents';

import { useAssets } from '@hooks/useAssets';

const PoolCreate = () => {
  const { api, theme } = useAccounts();
  const { createPool, getNativeMetadata, getFreePoolTokens, nativeMetadata, freePoolTokens } = useAssets();
  const [newPoolToken, setNewPoolToken] = useState<string>('-1');

  const submitCreatePool = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const selectedPoolToken = freePoolTokens?.[Number(newPoolToken)];
      if (selectedPoolToken) createPool(selectedPoolToken.id);
    },
    [createPool, freePoolTokens, newPoolToken],
  );

  useEffect(() => {
    getNativeMetadata();
    getFreePoolTokens();
  }, [getNativeMetadata, getFreePoolTokens]);

  if (!api) {
    return null;
  }

  if (freePoolTokens === null || nativeMetadata === null) {
    return <>Loading data... please wait</>;
  }

  const freeTokensLeft = Array.isArray(freePoolTokens) && freePoolTokens.length > 0;
  const poolSetupFee = api.consts.assetConversion?.poolSetupFee ?? null;
  const decimals = api.registry.chainDecimals[0];

  return (
    <>
      <Title>Create Liquidity Pool</Title>
      <ModalStatus />
      <Form onSubmit={submitCreatePool}>
        <section>
          <br />
          Create a pool for {nativeMetadata?.name?.toUpperCase()} and{' '}
          <select onChange={(event) => setNewPoolToken(event.target.value)} defaultValue={newPoolToken?.toString()}>
            <option value='-1'> - select token - </option>
            {freePoolTokens.map((token, index) => (
              <option key={token.id.toString()} value={index.toString()}>
                {token.symbol?.toUpperCase()}
              </option>
            ))}
          </select>
          {poolSetupFee && !poolSetupFee.isZero() && (
            <>
              <br />
              <br />
              Pool creation price: {formatBalance(poolSetupFee as ToBn, { decimals, withZero: false })}
            </>
          )}
          <br />
          <br />
          {!freeTokensLeft && (
            <>
              <i>Every token already has a pool created</i>
              <br />
              <br />
            </>
          )}
          <Stack direction='horizontal' gap={2} className='justify-content-end'>
            <Link to='..'>
              <SSecondaryButton type='button' activeTheme={theme}>
                Back
              </SSecondaryButton>
            </Link>
            {freeTokensLeft && <BasicButton type='submit'>Create</BasicButton>}
          </Stack>
        </section>
      </Form>
    </>
  );
};

export default memo(PoolCreate);
