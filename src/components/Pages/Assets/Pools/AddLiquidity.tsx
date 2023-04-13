import { BN, formatBalance } from '@polkadot/util';
import type { ToBn } from '@polkadot/util/types';
import { Decimal } from 'decimal.js';
import { FormEvent, memo, useCallback, useEffect, useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/esm/Form';
import { Link } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton';

import ModalStatus from '@common/ModalStatus';
import Title from '@common/Title';

import { useAccounts } from '@contexts/AccountsContext';
import { useModalStatus } from '@contexts/ModalStatusContext';

import { ADD_LIQUIDITY_SLIPPAGE } from '@helpers/config';
import { ModalStatusTypes, StatusMessages } from '@helpers/constants';
import {
  NativeTokenMetadata,
  PalletAssetConversionMultiAssetId,
  PoolReserves,
  TokenMetadata,
} from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import {
  addSlippage,
  calcExchangeRate,
  formatDecimals,
  getCleanFormattedBalance,
  isPoolEmpty,
  pricePattern,
  unitToPlanck,
} from '@helpers/utilities';

import { useAssets } from '@hooks/useAssets';

interface AddLiquidityProps {
  asset1: PalletAssetConversionMultiAssetId;
  asset2: PalletAssetConversionMultiAssetId;
  nativeMetadata: NativeTokenMetadata;
  assetMetadata: TokenMetadata;
  minAmount1: BN;
  minAmount2: BN;
  poolReserves: PoolReserves;
  isNewPool: boolean;
  nativeBalance: BN | null;
  assetBalance: BN | null;
}

const AddLiquidity = ({
  asset1,
  asset2,
  nativeMetadata,
  assetMetadata,
  minAmount1,
  minAmount2,
  poolReserves,
  isNewPool,
  nativeBalance,
  assetBalance,
}: AddLiquidityProps) => {
  const { activeAccount, theme } = useAccounts();
  const { addLiquidity } = useAssets();
  const { openModalStatus, setStatus } = useModalStatus();
  const [asset1Amount, setAsset1Amount] = useState<string>('');
  const [asset2Amount, setAsset2Amount] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<Decimal | null>(null);

  const submitAddLiquidity = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!activeAccount || !assetBalance || !nativeBalance || !asset1Amount || !asset2Amount) return;

      const amount1 = new BN(unitToPlanck(asset1Amount, nativeMetadata.decimals));
      const amount2 = new BN(unitToPlanck(asset2Amount, assetMetadata.decimals));
      let formError = null;

      if (isNewPool) {
        // validate min balances
        if (amount1.lt(minAmount1)) {
          const minAmountFormatted = formatBalance(minAmount1, {
            withUnit: nativeMetadata.name?.toUpperCase(),
            decimals: nativeMetadata.decimals,
            withSi: true,
            withZero: false,
          });
          formError = StatusMessages.POOL_MIN_LIQUIDITY_ERROR.replace('{amount}', minAmountFormatted);
        }

        if (!formError && amount2.lt(minAmount2)) {
          const minAmountFormatted = formatBalance(minAmount2, {
            withUnit: assetMetadata.symbol.toUpperCase(),
            decimals: assetMetadata.decimals,
            withSi: true,
            withZero: false,
          });
          formError = StatusMessages.POOL_MIN_LIQUIDITY_ERROR.replace('{amount}', minAmountFormatted);
        }
      }

      // validate user has enough funds
      if (!formError && nativeBalance.lt(amount1)) {
        formError = StatusMessages.POOL_ADD_LIQUIDITY_AMOUNT_TOO_HIGH;
      }
      if (!formError && assetBalance.lt(amount2)) {
        formError = StatusMessages.POOL_ADD_LIQUIDITY_AMOUNT_TOO_HIGH;
      }

      if (formError) {
        setStatus({ type: ModalStatusTypes.ERROR, message: formError });
        openModalStatus();
        return;
      }

      // add slippage tolerance to min amounts
      const slippage = ADD_LIQUIDITY_SLIPPAGE;
      const amount1Min = new BN(unitToPlanck(addSlippage(asset1Amount, slippage), nativeMetadata.decimals));
      const amount2Min = new BN(unitToPlanck(addSlippage(asset2Amount, slippage), assetMetadata.decimals));

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
      assetBalance,
      assetMetadata,
      addLiquidity,
      nativeBalance,
      nativeMetadata,
      isNewPool,
      openModalStatus,
      setStatus,
    ],
  );

  const onInput1Changed = (amount1: string) => {
    if (amount1 !== '' && !amount1.match(pricePattern(nativeMetadata.decimals))) return;

    setAsset1Amount(amount1);
    const isNewPool = isPoolEmpty(poolReserves);
    const asset1Value = amount1;
    const asset2Value = asset2Amount;

    if (isNewPool) {
      const exchangeRate = asset1Value && asset2Value ? calcExchangeRate(+asset1Value, +asset2Value) : null;
      setExchangeRate(exchangeRate);
    } else if (exchangeRate) {
      setAsset2Amount(amount1 ? formatDecimals(exchangeRate.mul(asset1Value)) : '');
    }
  };

  const onInput2Changed = (amount2: string) => {
    if (amount2 !== '' && !amount2.match(pricePattern(assetMetadata.decimals))) return;

    setAsset2Amount(amount2);
    const isNewPool = isPoolEmpty(poolReserves);
    const asset1Value = asset1Amount;
    const asset2Value = amount2;

    if (isNewPool) {
      const exchangeRate = asset1Value && asset2Value ? calcExchangeRate(+asset1Value, +asset2Value) : null;
      setExchangeRate(exchangeRate);
    } else if (exchangeRate) {
      setAsset1Amount(amount2 ? formatDecimals(new Decimal(asset2Value).div(exchangeRate)) : '');
    }
  };

  useEffect(() => {
    if (!isNewPool) {
      const asset1Reserve = getCleanFormattedBalance(poolReserves[0], nativeMetadata.decimals);
      const asset2Reserve = getCleanFormattedBalance(poolReserves[1], assetMetadata.decimals);
      setExchangeRate(calcExchangeRate(+asset1Reserve, +asset2Reserve));
    }
  }, [isNewPool, poolReserves, assetMetadata, nativeMetadata]);

  const nativeDecimals = nativeMetadata.decimals;
  const assetDecimals = assetMetadata.decimals;
  const nativeName = nativeMetadata.name?.toUpperCase();
  const assetName = assetMetadata.name.toUpperCase();
  const assetSymbol = assetMetadata.symbol.toUpperCase();

  return (
    <>
      <Title className='XXL'>Add Liquidity</Title>
      <ModalStatus />
      <Form onSubmit={submitAddLiquidity}>
        <Form.Group className='mb-3'>
          <Form.Label>{nativeName}:</Form.Label>
          <Form.Control
            value={asset1Amount}
            placeholder='0.0'
            type='text'
            pattern={pricePattern(nativeDecimals)}
            onChange={(event) => onInput1Changed(event.target.value)}
            min={0}
          />
          {activeAccount && nativeBalance && (
            <div>
              Balance:{' '}
              {formatBalance(nativeBalance as ToBn, {
                forceUnit: '-',
                decimals: nativeDecimals,
                withSi: false,
                withZero: false,
              })}{' '}
              <ActionButton
                className='main XS'
                type='button'
                activeTheme={theme}
                action={() => onInput1Changed(getCleanFormattedBalance(nativeBalance as BN, nativeDecimals))}
              >
                Max
              </ActionButton>
            </div>
          )}
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>{assetName}:</Form.Label>
          <Form.Control
            value={asset2Amount}
            placeholder='0.0'
            type='text'
            pattern={pricePattern(assetDecimals)}
            onChange={(event) => onInput2Changed(event.target.value)}
            min={0}
          />
          {activeAccount && assetBalance && (
            <div>
              Balance:{' '}
              {formatBalance(assetBalance as ToBn, {
                forceUnit: '-',
                decimals: assetDecimals,
                withSi: false,
                withZero: false,
              })}{' '}
              <ActionButton
                className='main XS'
                type='button'
                activeTheme={theme}
                action={() => onInput2Changed(getCleanFormattedBalance(assetBalance as BN, assetDecimals))}
              >
                Max
              </ActionButton>
            </div>
          )}
        </Form.Group>
        {exchangeRate && (
          <section>
            1 {nativeName} = {formatDecimals(exchangeRate)} {assetSymbol}
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
