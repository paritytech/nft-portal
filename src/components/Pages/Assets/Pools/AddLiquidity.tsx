import { PalletAssetsAssetDetails, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';
import { BN, BN_ZERO, formatBalance } from '@polkadot/util';
import type { ToBn } from '@polkadot/util/types';
import { FormEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/esm/Form';
import { Link } from 'react-router-dom';

import BasicButton from '@buttons/BasicButton';

import ModalStatus from '@common/ModalStatus';
import Title from '@common/Title';

import { useAccounts } from '@contexts/AccountsContext';
import { useModalStatus } from '@contexts/ModalStatusContext';

import { ModalStatusTypes, StatusMessages } from '@helpers/constants';
import { PalletAssetConversionMultiAssetId, PoolReserves } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SActionButtonXMini, SSecondaryButton } from '@helpers/styledComponents';
import {
  calcExchangeRate,
  getAssetDecimals,
  getAssetName,
  getAssetSymbol,
  isPoolEmpty,
  pricePattern,
  unitToPlanck,
} from '@helpers/utilities';

import { useAssets } from '@hooks/useAssets';

interface AddLiquidityProps {
  asset1: PalletAssetConversionMultiAssetId;
  asset2: PalletAssetConversionMultiAssetId;
}

// TODO:
// > on field change calc the amount and put into another field
// compare with uniswap code

const getCleanFormattedBalance = (planck: BN, decimals: number): string => {
  return formatBalance(planck as ToBn, {
    forceUnit: '-',
    decimals,
    withSi: false,
    withZero: false,
  }).replaceAll(',', '');
};

const AddLiquidity = ({ asset1, asset2 }: AddLiquidityProps) => {
  const { activeAccount, api, theme } = useAccounts();
  const {
    addLiquidity,
    getAssetBalance,
    getAssetMetadata,
    getNativeBalance,
    getNativeMetadata,
    getPoolReserves,
    nativeMetadata,
    nativeBalance,
  } = useAssets();
  const { openModalStatus, setStatus } = useModalStatus();
  const asset1Amount = useRef<HTMLInputElement | null>(null);
  const asset2Amount = useRef<HTMLInputElement | null>(null);
  const [assetBalance, setAssetBalance] = useState<BN>(BN_ZERO);
  const [assetMetadata, setAssetMetadata] = useState<[PalletAssetsAssetMetadata, PalletAssetsAssetDetails | null]>();
  const [poolReserves, setPoolReserves] = useState<PoolReserves>();
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  const submitAddLiquidity = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!activeAccount || !assetMetadata || !nativeMetadata || !nativeBalance) return;

      const asset1Value = asset1Amount.current?.value;
      const asset2Value = asset2Amount.current?.value;
      if (!asset1Value || !asset2Value) return;

      const amount1 = new BN(unitToPlanck(asset1Value, nativeMetadata.decimals));
      const amount2 = new BN(unitToPlanck(asset2Value, getAssetDecimals(assetMetadata[0])));
      const isNewPool = isPoolEmpty(poolReserves);
      let formError = null;

      if (isNewPool) {
        // validate min balances
        const minAmount1 = api.consts.balances.existentialDeposit;
        const minAmount2 = assetMetadata[1]?.minBalance.toBn() || BN_ZERO;

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
            withUnit: getAssetSymbol(assetMetadata[0]).toUpperCase(),
            decimals: getAssetDecimals(assetMetadata[0]),
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

      addLiquidity(asset1, asset2, amount1, amount2);
    },
    [
      api,
      asset1,
      asset2,
      activeAccount,
      assetBalance,
      assetMetadata,
      addLiquidity,
      nativeBalance,
      nativeMetadata,
      openModalStatus,
      poolReserves,
      setStatus,
    ],
  );

  const onInput1Changed = (amount1) => {
    const isNewPool = isPoolEmpty(poolReserves);
    const asset1Value = amount1;
    const asset2Value = asset2Amount.current?.value;

    if (isNewPool) {
      const exchangeRate = asset1Value && asset2Value ? calcExchangeRate(+asset1Value, +asset2Value) : null;
      setExchangeRate(exchangeRate);
    } else {
      // TODO: the exchange rate should be already there, so update the other field
    }
  };

  const onInput2Changed = (amount2) => {
    const isNewPool = isPoolEmpty(poolReserves);
    const asset1Value = asset1Amount.current?.value;
    const asset2Value = amount2;

    if (isNewPool) {
      const exchangeRate = asset1Value && asset2Value ? calcExchangeRate(+asset1Value, +asset2Value) : null;
      setExchangeRate(exchangeRate);
    } else {
      // TODO: the exchange rate should be already there, so update the other field
    }
  };

  const setMax = (field, fullAmount, decimals, cb) => {
    field.current.value = getCleanFormattedBalance(fullAmount, decimals);
    cb(field.current.value);
  };

  useEffect(() => {
    if (api) {
      if (asset1 && asset2) {
        getAssetMetadata(asset2.asAsset).then(setAssetMetadata);
        getPoolReserves(asset1, asset2).then(setPoolReserves);
      }
      if (activeAccount && asset2) {
        getAssetBalance(asset2.asAsset).then((balance) => setAssetBalance(balance || BN_ZERO));
        getNativeBalance();
      }
    }
  }, [api, activeAccount, asset1, asset2, getAssetBalance, getAssetMetadata, getNativeBalance, getPoolReserves]);

  useEffect(() => {
    if (api && !nativeMetadata) {
      getNativeMetadata();
    }
  }, [api, getNativeMetadata, nativeMetadata]);

  useEffect(() => {
    if (poolReserves && !isPoolEmpty(poolReserves) && assetMetadata && nativeMetadata) {
      const asset1Reserve = getCleanFormattedBalance(poolReserves[0], nativeMetadata.decimals);
      const asset2Reserve = getCleanFormattedBalance(poolReserves[1], getAssetDecimals(assetMetadata[0]));
      setExchangeRate(calcExchangeRate(+asset1Reserve, +asset2Reserve));
    }
  }, [poolReserves, assetMetadata, nativeMetadata]);

  if (!api) {
    return null;
  }

  if (!nativeMetadata || !assetMetadata) {
    return <>Loading data... please wait</>;
  }

  const nativeDecimals = nativeMetadata.decimals;
  const assetDecimals = getAssetDecimals(assetMetadata[0]);
  const nativeName = nativeMetadata.name?.toUpperCase();
  const assetName = getAssetName(assetMetadata[0]).toUpperCase();
  const assetSymbol = getAssetSymbol(assetMetadata[0]).toUpperCase();

  return (
    <>
      <Title>Add Liquidity</Title>
      <ModalStatus />
      <Form onSubmit={submitAddLiquidity}>
        <Form.Group className='mb-3'>
          <Form.Label>{nativeName}:</Form.Label>
          <Form.Control
            ref={asset1Amount}
            placeholder='0.0'
            type='number'
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
              <SActionButtonXMini
                type='button'
                isDisabled={false}
                activeTheme={theme}
                action={() => setMax(asset1Amount, nativeBalance, nativeDecimals, onInput1Changed)}
              >
                Max
              </SActionButtonXMini>
            </div>
          )}
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>{assetName}:</Form.Label>
          <Form.Control
            ref={asset2Amount}
            placeholder='0.0'
            type='number'
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
              <SActionButtonXMini
                type='button'
                isDisabled={false}
                activeTheme={theme}
                action={() => setMax(asset2Amount, assetBalance, assetDecimals, onInput2Changed)}
              >
                Max
              </SActionButtonXMini>
            </div>
          )}
        </Form.Group>
        {exchangeRate && (
          <section>
            1 {nativeName} = {exchangeRate} {assetSymbol}
          </section>
        )}

        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <Link to={routes.discover.pools}>
            <SSecondaryButton type='button' activeTheme={theme}>
              Back
            </SSecondaryButton>
          </Link>
          {activeAccount && <BasicButton type='submit'>Add</BasicButton>}
          {!activeAccount && <BasicButton>Please login</BasicButton>}
        </Stack>
      </Form>
    </>
  );
};

export default memo(AddLiquidity);
