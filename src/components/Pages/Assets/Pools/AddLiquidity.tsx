import { BN, formatBalance } from '@polkadot/util';
import type { ToBn } from '@polkadot/util/types';
import { Decimal } from 'decimal.js';
import { FormEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton.tsx';

import ModalStatus from '@common/ModalStatus.tsx';
import Title from '@common/Title.tsx';

import { useAccounts } from '@contexts/AccountsContext.tsx';
import { useModalStatus } from '@contexts/ModalStatusContext.tsx';

import { ADD_LIQUIDITY_SLIPPAGE } from '@helpers/config.ts';
import { ModalStatusTypes, StatusMessages } from '@helpers/constants.ts';
import { MultiAssetId, PoolReserves, TokenMetadata } from '@helpers/interfaces.ts';
import { routes } from '@helpers/routes.ts';
import {
  applySlippage,
  calcExchangeRate,
  formatDecimals,
  formatExchangeRate,
  getCleanFormattedBalance,
  pricePattern,
  unitToPlanck,
} from '@helpers/utilities.ts';

import { useAssets } from '@hooks/useAssets.ts';

interface AddLiquidityProps {
  asset1: MultiAssetId;
  asset2: MultiAssetId;
  asset1Metadata: TokenMetadata;
  asset2Metadata: TokenMetadata;
  minAmount1: BN | undefined;
  minAmount2: BN | undefined;
  poolReserves: PoolReserves;
  isNewPool: boolean;
  asset1Balance: BN | undefined;
  asset2Balance: BN | undefined;
}

const AddLiquidity = ({
  asset1,
  asset2,
  asset1Metadata,
  asset2Metadata,
  minAmount1,
  minAmount2,
  poolReserves,
  isNewPool,
  asset1Balance,
  asset2Balance,
}: AddLiquidityProps) => {
  const { activeAccount } = useAccounts();
  const { addLiquidity } = useAssets();
  const { openModalStatus, setStatus } = useModalStatus();
  const [asset1Amount, setAsset1Amount] = useState<string>('');
  const [asset2Amount, setAsset2Amount] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<Decimal | null>(null);

  const submitAddLiquidity = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!activeAccount || !asset1Balance || !asset2Balance || !asset1Amount || !asset2Amount) return;

      const amount1 = new BN(unitToPlanck(asset1Amount, asset1Metadata.decimals));
      const amount2 = new BN(unitToPlanck(asset2Amount, asset2Metadata.decimals));
      let formError = null;

      if (isNewPool) {
        // validate min balances
        if (minAmount1 && amount1.lt(minAmount1)) {
          const minAmountFormatted = formatBalance(minAmount1, {
            withUnit: asset1Metadata.symbol.toUpperCase(),
            decimals: asset1Metadata.decimals,
            withSi: true,
            withZero: false,
          });
          formError = StatusMessages.POOL_MIN_LIQUIDITY_ERROR.replace('{amount}', minAmountFormatted);
        }

        if (!formError && minAmount2 && amount2.lt(minAmount2)) {
          const minAmountFormatted = formatBalance(minAmount2, {
            withUnit: asset2Metadata.symbol.toUpperCase(),
            decimals: asset2Metadata.decimals,
            withSi: true,
            withZero: false,
          });
          formError = StatusMessages.POOL_MIN_LIQUIDITY_ERROR.replace('{amount}', minAmountFormatted);
        }
      }

      // validate user has enough funds
      if (!formError && asset1Balance.lt(amount1)) {
        formError = StatusMessages.POOL_AMOUNT_TOO_HIGH;
      }
      if (!formError && asset2Balance.lt(amount2)) {
        formError = StatusMessages.POOL_AMOUNT_TOO_HIGH;
      }

      if (formError) {
        setStatus({ type: ModalStatusTypes.ERROR, message: formError });
        openModalStatus();
        return;
      }

      // add slippage tolerance to min amounts
      const slippage = ADD_LIQUIDITY_SLIPPAGE;
      const amount1Min = new BN(
        unitToPlanck(applySlippage(asset1Amount, true, slippage, asset1Metadata.decimals), asset1Metadata.decimals),
      );
      const amount2Min = new BN(
        unitToPlanck(applySlippage(asset2Amount, true, slippage, asset2Metadata.decimals), asset2Metadata.decimals),
      );

      addLiquidity(asset1, asset2, amount1, amount2, amount1Min, amount2Min);
    },
    [
      asset1,
      asset2,
      asset1Amount,
      asset2Amount,
      minAmount1,
      minAmount2,
      activeAccount,
      asset1Balance,
      asset2Balance,
      asset1Metadata,
      asset2Metadata,
      addLiquidity,
      isNewPool,
      openModalStatus,
      setStatus,
    ],
  );

  const onInput1Changed = (amount1: string) => {
    if (amount1 !== '' && !amount1.match(pricePattern(asset1Metadata.decimals))) return;

    setAsset1Amount(amount1);
    const asset1Value = amount1;
    const asset2Value = asset2Amount;

    if (isNewPool) {
      const exchangeRate =
        asset1Value && asset2Value
          ? calcExchangeRate(
              [
                new BN(unitToPlanck(asset1Value, asset1Metadata.decimals)),
                new BN(unitToPlanck(asset2Value, asset2Metadata.decimals)),
              ],
              asset1Metadata.decimals,
              asset2Metadata.decimals,
            )
          : null;
      setExchangeRate(exchangeRate);
    } else if (exchangeRate) {
      setAsset2Amount(amount1 ? formatDecimals(exchangeRate.mul(asset1Value)) : '');
    }
  };

  const onInput2Changed = (amount2: string) => {
    if (amount2 !== '' && !amount2.match(pricePattern(asset2Metadata.decimals))) return;

    setAsset2Amount(amount2);
    const asset1Value = asset1Amount;
    const asset2Value = amount2;

    if (isNewPool) {
      const exchangeRate =
        asset1Value && asset2Value
          ? calcExchangeRate(
              [
                new BN(unitToPlanck(asset1Value, asset1Metadata.decimals)),
                new BN(unitToPlanck(asset2Value, asset2Metadata.decimals)),
              ],
              asset1Metadata.decimals,
              asset2Metadata.decimals,
            )
          : null;
      setExchangeRate(exchangeRate);
    } else if (exchangeRate) {
      setAsset1Amount(amount2 ? formatDecimals(new Decimal(asset2Value).div(exchangeRate)) : '');
    }
  };

  useEffect(() => {
    if (!isNewPool) {
      setExchangeRate(calcExchangeRate(poolReserves, asset1Metadata.decimals, asset2Metadata.decimals));
    }
  }, [isNewPool, poolReserves, asset1Metadata?.decimals, asset2Metadata?.decimals]);

  const formattedExchangeRate = useMemo(() => (exchangeRate ? formatExchangeRate(exchangeRate) : ''), [exchangeRate]);

  return (
    <>
      <Title className='XXL'>Add Liquidity</Title>
      <ModalStatus />
      <Form onSubmit={submitAddLiquidity}>
        <Form.Group className='mb-3'>
          <Form.Label>{asset1Metadata.symbol.toUpperCase()}:</Form.Label>
          <Form.Control
            value={asset1Amount}
            placeholder='0.0'
            type='text'
            pattern={pricePattern(asset1Metadata.decimals)}
            onChange={(event) => onInput1Changed(event.target.value)}
            min={0}
          />
          {activeAccount && asset1Balance && (
            <div>
              Balance:{' '}
              {formatBalance(asset1Balance as unknown as ToBn, {
                forceUnit: '-',
                decimals: asset1Metadata.decimals,
                withSi: false,
                withZero: false,
              })}{' '}
              <ActionButton
                className='main XS'
                type='button'
                action={() => onInput1Changed(getCleanFormattedBalance(asset1Balance as BN, asset1Metadata.decimals))}
              >
                Max
              </ActionButton>
            </div>
          )}
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>{asset2Metadata.symbol.toUpperCase()}:</Form.Label>
          <Form.Control
            value={asset2Amount}
            placeholder='0.0'
            type='text'
            pattern={pricePattern(asset2Metadata.decimals)}
            onChange={(event) => onInput2Changed(event.target.value)}
            min={0}
          />
          {activeAccount && asset2Balance && (
            <div>
              Balance:{' '}
              {formatBalance(asset2Balance as unknown as ToBn, {
                forceUnit: '-',
                decimals: asset2Metadata.decimals,
                withSi: false,
                withZero: false,
              })}{' '}
              <ActionButton
                className='main XS'
                type='button'
                action={() => onInput2Changed(getCleanFormattedBalance(asset2Balance as BN, asset2Metadata.decimals))}
              >
                Max
              </ActionButton>
            </div>
          )}
        </Form.Group>
        {exchangeRate && (
          <section>
            1 {asset1Metadata.symbol.toUpperCase()} ≈ {formattedExchangeRate} {asset2Metadata.symbol.toUpperCase()}
          </section>
        )}

        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <Link to={routes.discover.pools}>
            <ActionButton type='button' className='secondary S'>
              Back
            </ActionButton>
          </Link>
          {activeAccount && (
            <ActionButton type='submit' className='main S'>
              Add
            </ActionButton>
          )}
          {!activeAccount && (
            <ActionButton className='main S' isDisabled={true}>
              Please login
            </ActionButton>
          )}
        </Stack>
      </Form>
    </>
  );
};

export default memo(AddLiquidity);
