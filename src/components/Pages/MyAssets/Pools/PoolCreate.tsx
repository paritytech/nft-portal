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

import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';

import { useAssets } from '@hooks/useAssets';

const PoolCreate = () => {
  const { api, theme } = useAccounts();
  const { createPool, getNativeMetadata, getAvailablePoolTokens, nativeMetadata, availablePoolTokens } = useAssets();
  const [newPoolToken, setNewPoolToken] = useState<string>('-1');

  const submitCreatePool = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const selectedPoolToken = availablePoolTokens?.[Number(newPoolToken)];
      if (selectedPoolToken) createPool(selectedPoolToken.id);
    },
    [createPool, availablePoolTokens, newPoolToken],
  );

  useEffect(() => {
    getNativeMetadata();
    getAvailablePoolTokens();
  }, [getNativeMetadata, getAvailablePoolTokens]);

  if (!api) {
    return null;
  }

  if (availablePoolTokens === null || nativeMetadata === null) {
    return <>Loading data... please wait</>;
  }

  const availableTokensLeft = Array.isArray(availablePoolTokens) && availablePoolTokens.length > 0;
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
            {availablePoolTokens.map((token, index) => (
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
          {!availableTokensLeft && (
            <>
              <i>Every token already has a pool created</i>
              <br />
              <br />
            </>
          )}
          <Stack direction='horizontal' gap={2} className='justify-content-end'>
            <Link to={routes.discover.pools}>
              <SSecondaryButton type='button' activeTheme={theme}>
                Back
              </SSecondaryButton>
            </Link>
            {availableTokensLeft && <BasicButton type='submit'>Create</BasicButton>}
          </Stack>
        </section>
      </Form>
    </>
  );
};

export default memo(PoolCreate);
