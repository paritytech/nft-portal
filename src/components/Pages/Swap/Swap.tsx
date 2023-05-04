import { BN, formatBalance } from '@polkadot/util';
import type { ToBn } from '@polkadot/util/types';
import { Decimal } from 'decimal.js';
import { FormEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/esm/Form';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';

import ModalStatus from '@common/ModalStatus';
import Title from '@common/Title';

import { useAccounts } from '@contexts/AccountsContext';
import { useModalStatus } from '@contexts/ModalStatusContext';

import { ModalStatusTypes, StatusMessages, SwapTypes } from '@helpers/constants';
import { MultiAssetId, PoolId, PoolReserves, TokenMetadata } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import {
  applySlippage,
  calcExchangeRate,
  calcPriceImpact,
  calcSwapAmountIn,
  calcSwapAmountOut,
  formatDecimals,
  formatExchangeRate,
  getCleanFormattedBalance,
  isPoolEmpty,
  multiAssetToParam,
  pricePattern,
  toMultiAsset,
  unitToPlanck,
} from '@helpers/utilities';

import { useAssets } from '@hooks/useAssets';

const SNotification = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px red solid;
  border-radius: 5px;
`;

// TODO: make it configurable and store in localstorage
const SLIPPAGE = 0.5; //0.5%

interface SwapProps {
  asset1: MultiAssetId;
  asset2: MultiAssetId;
  pool: PoolId;
  asset1Metadata: TokenMetadata;
  asset2Metadata: TokenMetadata;
  minKeepAmount1: BN;
  minKeepAmount2: BN;
  poolReserves: PoolReserves;
  asset1Balance: BN | undefined;
  asset2Balance: BN | undefined;
  swapFee: number;
  poolTokenPairs: TokenMetadata[][];
  handleTokenChange: (assetId1: MultiAssetId, assetId2: MultiAssetId) => void;
}

const Swap = ({
  asset1,
  asset2,
  pool,
  asset1Metadata,
  asset2Metadata,
  minKeepAmount1,
  minKeepAmount2,
  poolReserves,
  asset1Balance,
  asset2Balance,
  swapFee,
  poolTokenPairs,
  handleTokenChange,
}: SwapProps) => {
  const { activeAccount, api } = useAccounts();
  const { swap } = useAssets();
  const { openModalStatus, setStatus } = useModalStatus();
  const [asset1Amount, setAsset1Amount] = useState<string>('');
  const [asset2Amount, setAsset2Amount] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<Decimal>();
  const [notification, setNotification] = useState<string>('');
  const [impact, setImpact] = useState<number | null>(null);
  const [afterSlippage, setAfterSlippage] = useState<string>('');
  const [formDisabled, setFormDisabled] = useState<boolean>(true);
  const [swapType, setSwapType] = useState<SwapTypes | null>(null);

  const reserves: [BN, BN] = useMemo(
    () => (pool[0] === asset1 ? poolReserves : [poolReserves[1], poolReserves[0]]),
    [pool, asset1, poolReserves],
  );

  const formattedExchangeRate = useMemo(() => (exchangeRate ? formatExchangeRate(exchangeRate) : ''), [exchangeRate]);

  const defaultExchangeRate = useMemo(() => {
    if (!isPoolEmpty(reserves)) {
      return calcSwapAmountOut(
        reserves,
        new BN(unitToPlanck('1', asset1Metadata.decimals)),
        asset2Metadata.decimals,
        swapFee,
      );
    }
  }, [reserves, asset1Metadata, asset2Metadata, swapFee]);

  const idealExchangeRate = useMemo(() => {
    if (!isPoolEmpty(reserves)) {
      return calcExchangeRate(reserves, asset1Metadata.decimals, asset2Metadata.decimals);
    }
  }, [reserves, asset1Metadata, asset2Metadata]);

  const tokenOptions1 = useMemo(
    () =>
      poolTokenPairs
        .filter(
          (poolTokenPair) =>
            poolTokenPair[0].symbol === asset2Metadata.symbol || poolTokenPair[1].symbol === asset2Metadata.symbol,
        )
        .map((poolTokenPair) =>
          poolTokenPair[0].symbol === asset2Metadata.symbol ? poolTokenPair[1] : poolTokenPair[0],
        ),
    [asset2Metadata.symbol, poolTokenPairs],
  );

  const tokenOptions2 = useMemo(
    () =>
      poolTokenPairs
        .filter(
          (poolTokenPair) =>
            poolTokenPair[0].symbol === asset1Metadata.symbol || poolTokenPair[1].symbol === asset1Metadata.symbol,
        )
        .map((poolTokenPair) =>
          poolTokenPair[0].symbol === asset1Metadata.symbol ? poolTokenPair[1] : poolTokenPair[0],
        ),
    [asset1Metadata.symbol, poolTokenPairs],
  );

  const onInput1Changed = (amount1: string) => {
    setNotification('');
    if (amount1 === '') {
      setAsset1Amount('');
      setAsset2Amount('');
      return;
    }

    if (!amount1.match(pricePattern(asset1Metadata.decimals))) return;

    setAsset1Amount(amount1);
    setSwapType(SwapTypes.EXACT_IN);

    const amountIn = unitToPlanck(amount1, asset1Metadata.decimals);
    const amountOut = calcSwapAmountOut(reserves, new BN(amountIn), asset2Metadata.decimals, swapFee);
    setAsset2Amount(formatDecimals(amountOut, Decimal.ROUND_DOWN));
  };

  const onInput2Changed = (amount2: string) => {
    setNotification('');
    if (amount2 === '') {
      setAsset1Amount('');
      setAsset2Amount('');
      return;
    }

    if (!amount2.match(pricePattern(asset2Metadata.decimals))) return;

    setAsset2Amount(amount2);
    setSwapType(SwapTypes.EXACT_OUT);

    const amountOut = unitToPlanck(amount2, asset2Metadata.decimals);
    const amountIn = calcSwapAmountIn(reserves, new BN(amountOut), asset1Metadata.decimals, swapFee);

    if (!amountIn) setNotification('Insufficient liquidity for this trade.');

    setAsset1Amount(amountIn ? formatDecimals(amountIn, Decimal.ROUND_UP) : '');
  };

  const submitSwap = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (formDisabled || !activeAccount || swapType === null) return;

      const amount1 = new BN(unitToPlanck(asset1Amount, asset1Metadata.decimals));
      const amount2 = new BN(unitToPlanck(asset2Amount, asset2Metadata.decimals));
      let formError: StatusMessages | string | null = null;

      // validate max balances
      if (swapType === SwapTypes.EXACT_IN) {
        const maxSwapAmount: BN = reserves[1].sub(minKeepAmount2);
        if (amount2.gt(maxSwapAmount)) {
          const maxAmountFormatted = formatBalance(maxSwapAmount, {
            withUnit: asset2Metadata.symbol.toUpperCase(),
            decimals: asset2Metadata.decimals,
            withSi: true,
            withZero: false,
          });
          formError = StatusMessages.POOL_SWAP_MAX_AMOUNT_ERROR.replace('{amount}', maxAmountFormatted);
        }
      } else {
        const maxSwapAmount: BN = reserves[0].sub(minKeepAmount1);
        if (amount1.gt(maxSwapAmount)) {
          const maxAmountFormatted = formatBalance(maxSwapAmount, {
            withUnit: asset1Metadata.symbol.toUpperCase(),
            decimals: asset1Metadata.decimals,
            withSi: true,
            withZero: false,
          });
          formError = StatusMessages.POOL_SWAP_MAX_AMOUNT_ERROR.replace('{amount}', maxAmountFormatted);
        }
      }

      // validate user has enough funds
      if (!formError && asset1Balance?.lt(amount1)) {
        formError = StatusMessages.POOL_AMOUNT_TOO_HIGH;
      }
      if (!formError && asset2Balance?.lt(amount2)) {
        formError = StatusMessages.POOL_AMOUNT_TOO_HIGH;
      }

      if (formError) {
        setStatus({ type: ModalStatusTypes.ERROR, message: formError });
        openModalStatus();
        return;
      }

      const amountWithSlippage =
        swapType === SwapTypes.EXACT_IN
          ? unitToPlanck(applySlippage(asset2Amount, true, SLIPPAGE, asset2Metadata.decimals), asset2Metadata.decimals)
          : unitToPlanck(
              applySlippage(asset1Amount, false, SLIPPAGE, asset1Metadata.decimals),
              asset1Metadata.decimals,
            );

      swap(asset1, asset2, amount1, amount2, new BN(amountWithSlippage), swapType);
    },
    [
      asset1,
      asset2,
      asset1Amount,
      asset2Amount,
      formDisabled,
      minKeepAmount1,
      minKeepAmount2,
      reserves,
      activeAccount,
      asset1Balance,
      asset2Balance,
      asset1Metadata,
      asset2Metadata,
      openModalStatus,
      setStatus,
      swap,
      swapType,
    ],
  );

  useEffect(() => {
    setImpact(null);
    setAfterSlippage('');
    setFormDisabled(true);

    if (+asset1Amount !== 0 && +asset2Amount !== 0 && typeof idealExchangeRate !== 'undefined') {
      const exchangeRate = new Decimal(asset2Amount).div(asset1Amount);
      setExchangeRate(exchangeRate);
      setImpact(calcPriceImpact(exchangeRate, idealExchangeRate));

      let calculatedSlippage;
      if (swapType === SwapTypes.EXACT_IN) {
        calculatedSlippage = applySlippage(asset2Amount, true, SLIPPAGE, asset2Metadata.decimals);
      } else {
        calculatedSlippage = applySlippage(asset1Amount, false, SLIPPAGE, asset1Metadata.decimals);
      }

      setAfterSlippage(calculatedSlippage);
      setFormDisabled(false);
    } else if (defaultExchangeRate) {
      setExchangeRate(defaultExchangeRate);
    }
  }, [
    asset1Amount,
    asset2Amount,
    asset2Metadata.decimals,
    asset1Metadata.decimals,
    defaultExchangeRate,
    idealExchangeRate,
    swapType,
  ]);

  useEffect(() => {
    setAsset1Amount('');
    setAsset2Amount('');
  }, [asset1, asset2]);

  if (isPoolEmpty(reserves)) {
    return (
      <>
        The pool is empty. Please add some liquidity first{' '}
        <Link to={routes.discover.addLiquidity(multiAssetToParam(pool[0]), multiAssetToParam(pool[1]))}>here</Link>
      </>
    );
  }

  if (!api) {
    return null;
  }

  return (
    <>
      <Title className='XXL'>Swap</Title>
      <ModalStatus />

      <Form onSubmit={submitSwap}>
        <Form.Group className='mb-3'>
          <Form.Select
            className='mb-3'
            defaultValue={multiAssetToParam(asset1)}
            onChange={(event) =>
              handleTokenChange(toMultiAsset(api.createType('AssetId', event.target.value), api), asset2)
            }
          >
            {tokenOptions1.map(({ id, symbol }) => (
              <option key={symbol} value={multiAssetToParam(id)}>
                {symbol.toUpperCase()}
              </option>
            ))}
          </Form.Select>

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

        <Link to={routes.swap.assets(multiAssetToParam(asset2), multiAssetToParam(asset1))} title='Swap assets'>
          Flip sides
        </Link>
        <br />
        <br />

        <Form.Group className='mb-3'>
          <Form.Select
            className='mb-3'
            defaultValue={multiAssetToParam(asset2)}
            onChange={(event) =>
              handleTokenChange(asset1, toMultiAsset(api.createType('AssetId', event.target.value), api))
            }
          >
            {tokenOptions2.map(({ id, symbol }) => (
              <option key={symbol} value={multiAssetToParam(id)}>
                {symbol.toUpperCase()}
              </option>
            ))}
          </Form.Select>

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

        {notification && <SNotification>{notification}</SNotification>}
        {exchangeRate && (
          <section>
            1 {asset1Metadata.symbol.toUpperCase()} ≈ {formattedExchangeRate} {asset2Metadata.symbol.toUpperCase()}
          </section>
        )}
        <section>Price impact: {impact !== null ? `${impact}%` : '-'}</section>

        <section>Slippage tolerance: {SLIPPAGE}%</section>
        {afterSlippage && swapType === SwapTypes.EXACT_IN && (
          <section>Minimum received after slippage: {afterSlippage}</section>
        )}
        {afterSlippage && swapType === SwapTypes.EXACT_OUT && (
          <section>Maximum sent after slippage: {afterSlippage}</section>
        )}

        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <Link to={routes.discover.pools}>
            <ActionButton type='button' className='secondary S'>
              Back
            </ActionButton>
          </Link>
          {activeAccount && (
            <ActionButton type='submit' className='main S' isDisabled={formDisabled}>
              Swap
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

export default memo(Swap);
