import { formatBalance } from '@polkadot/util';
import type { ToBn } from '@polkadot/util/types';
import { FormEvent, memo, useCallback, useEffect, useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/esm/Form';
import { Link } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton';

import ModalStatus from '@common/ModalStatus';
import Title from '@common/Title';

import { useAccounts } from '@contexts/AccountsContext';
import { useModalStatus } from '@contexts/ModalStatusContext';

import { ModalStatusTypes, StatusMessages } from '@helpers/constants';
import { routes } from '@helpers/routes';

import { useAssets } from '@hooks/useAssets';

const PoolCreate = () => {
  const { api } = useAccounts();
  const {
    createPool,
    getAvailablePoolTokens,
    getNativeBalance,
    getNativeMetadata,
    nativeBalance,
    nativeMetadata,
    availablePoolTokens,
  } = useAssets();
  const { openModalStatus, setStatus } = useModalStatus();
  const [newPoolToken, setNewPoolToken] = useState<string>('-1');

  const submitCreatePool = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const selectedPoolToken = availablePoolTokens?.[Number(newPoolToken)];
      if (api && selectedPoolToken) {
        // validate user has enough funds to cover the setup fee
        const poolSetupFee = api.consts.assetConversion?.poolSetupFee ?? null;
        const existentialDeposit = api.consts.balances.existentialDeposit;
        if (poolSetupFee && !poolSetupFee.isZero() && nativeBalance.lt(poolSetupFee.add(existentialDeposit))) {
          setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.POOL_INSUFFICIENT_BALANCE_FOR_DEPOSIT });
          openModalStatus();
          return;
        }
        createPool(selectedPoolToken.id);
      }
    },
    [api, availablePoolTokens, createPool, nativeBalance, newPoolToken, openModalStatus, setStatus],
  );

  useEffect(() => {
    getAvailablePoolTokens();
    getNativeBalance();
    getNativeMetadata();
  }, [getAvailablePoolTokens, getNativeBalance, getNativeMetadata]);

  if (!api) {
    return null;
  }

  if (availablePoolTokens === null || nativeMetadata === null || nativeBalance === null) {
    return <>Loading data... please wait</>;
  }

  const availableTokensLeft = Array.isArray(availablePoolTokens) && availablePoolTokens.length > 0;
  const poolSetupFee = api.consts.assetConversion?.poolSetupFee ?? null;
  const decimals = api.registry.chainDecimals[0];

  return (
    <>
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
              Pool creation fee: {formatBalance(poolSetupFee as ToBn, { decimals, withZero: false })}
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
              <ActionButton type='button' className='secondary S'>
                Back
              </ActionButton>
            </Link>
            {availableTokensLeft && (
              <ActionButton type='submit' className='main S'>
                Create
              </ActionButton>
            )}
          </Stack>
        </section>
      </Form>
    </>
  );
};

export default memo(PoolCreate);
