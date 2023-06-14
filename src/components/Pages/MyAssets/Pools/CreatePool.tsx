import { formatBalance } from '@polkadot/util';
import type { ToBn } from '@polkadot/util/types';
import { isEmpty } from 'lodash';
import { FormEvent, memo, useCallback, useEffect, useState } from 'react';
import { Form, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton.tsx';

import ModalStatus from '@common/ModalStatus.tsx';

import { useAccounts } from '@contexts/AccountsContext.tsx';
import { useModalStatus } from '@contexts/ModalStatusContext.tsx';

import { ModalStatusTypes, MultiAssets, StatusMessages } from '@helpers/constants.ts';
import { routes } from '@helpers/routes.ts';
import { toMultiAsset } from '@helpers/utilities.ts';

import { useAssets } from '@hooks/useAssets.ts';

const CreatePool = () => {
  const { api } = useAccounts();
  const {
    createPool,
    getAvailablePoolTokens,
    getNativeBalance,
    getNativeMetadata,
    availablePoolTokens,
    nativeBalance,
    nativeMetadata,
  } = useAssets();
  const { openModalStatus, setStatus } = useModalStatus();
  const [newPoolToken, setNewPoolToken] = useState<string>('-1');

  const submitCreatePool = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const selectedPoolToken = availablePoolTokens?.[Number(newPoolToken)];
      if (api && selectedPoolToken && nativeBalance) {
        // validate user has enough funds to cover the setup fee
        const poolSetupFee = api.consts.assetConversion?.poolSetupFee ?? null;
        const existentialDeposit = api.consts.balances.existentialDeposit;

        // TODO check later if we can add a proper type for poolSetupFee
        // @ts-ignore
        if (poolSetupFee && !poolSetupFee.isZero() && nativeBalance.lt(poolSetupFee.add(existentialDeposit))) {
          setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.POOL_INSUFFICIENT_BALANCE_FOR_DEPOSIT });
          openModalStatus();
          return;
        }
        createPool(toMultiAsset(MultiAssets.NATIVE, api), selectedPoolToken.id);
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

  if (!availablePoolTokens || !nativeMetadata || !nativeBalance) {
    return <>Loading data... please wait</>;
  }

  const availableTokensLeft = !isEmpty(availablePoolTokens);
  const poolSetupFee = api.consts.assetConversion?.poolSetupFee ?? null;
  const { symbol, decimals } = nativeMetadata;

  return (
    <>
      <ModalStatus />
      <Form onSubmit={submitCreatePool}>
        <section>
          <br />
          Create a pool for {symbol.toUpperCase()} and{' '}
          <select onChange={(event) => setNewPoolToken(event.target.value)} defaultValue={newPoolToken?.toString()}>
            <option value='-1'> - select token - </option>
            {availablePoolTokens.map((token, index) => (
              <option key={token.id.toString()} value={index.toString()}>
                {token.symbol.toUpperCase()}
              </option>
            ))}
          </select>
          {/* TODO check later if we can add a proper type for poolSetupFee
          @ts-ignore */}
          {poolSetupFee && !poolSetupFee.isZero() && (
            <>
              <br />
              <br />
              Pool creation fee: {formatBalance(poolSetupFee as unknown as ToBn, { decimals, withZero: false })}
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
              <ActionButton type='button' className='secondary'>
                Back
              </ActionButton>
            </Link>
            {availableTokensLeft && (
              <ActionButton type='submit' className='main'>
                Create
              </ActionButton>
            )}
          </Stack>
        </section>
      </Form>
    </>
  );
};

export default memo(CreatePool);
