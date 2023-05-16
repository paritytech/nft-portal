import { ApiPromise } from '@polkadot/api';
import { AssetId } from '@polkadot/types/interfaces';
import { BN, BN_ZERO, formatBalance } from '@polkadot/util';
import { ToBn } from '@polkadot/util/types';
import { Decimal } from 'decimal.js';

import { MultiAssets } from '@helpers/constants.ts';
import { MultiAssetId, PoolId, PoolReserves } from '@helpers/interfaces.ts';

export const ellipseAddress = (address = '', charCount = 4): string => {
  if (address === '') {
    return '';
  }

  return `${address.slice(0, charCount)}...${address.slice(-charCount)}`;
};

// the values are flipped to opposite because in the nfts pallet we use bitflags
// where we select what to disable, so in pallet true = disabled, false = enabled
// in order to not confuse users, in UI we use normal logic and then flip values here
export const convertToBitFlagValue = (values: boolean[]): number => {
  const bitFlag = values
    .map((value) => +!value)
    .reverse()
    .join('');

  return parseInt(bitFlag, 2);
};

export const getBlockNumber = async (api: ApiPromise, timestamp?: number): Promise<number | undefined> => {
  if (typeof timestamp === 'undefined') {
    return timestamp;
  }

  const blockTime = (api.consts.babe.expectedBlockTime.toPrimitive() as number) / 1000; // in seconds
  const activeBlockNumber = (await api.derive.chain.bestNumber()).toNumber();

  const currentDate = Math.floor(Date.now() / 1000); // current timestamp in seconds
  const laterDate = Math.floor(timestamp / 1000); // user provided timestamp in seconds

  return Math.floor((laterDate - currentDate) / blockTime + activeBlockNumber);
};

export const pricePattern = (maxPrecision: number): string => `^(0|[1-9][0-9]*)([.][0-9]{0,${maxPrecision}})?$`;
export const wholeNumbersPattern = '^[0-9]*$';

export const unitToPlanck = (units: string, decimals: number): string => {
  const separated = units.split('.');
  const [whole] = separated;
  let [, decimal] = separated;

  if (typeof decimal === 'undefined') {
    decimal = '';
  }

  return `${whole}${decimal.padEnd(decimals, '0')}`.replace(/^0+/, '');
};

export const generateAssetId = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const sortStrings = (string1: string | null, string2: string | null): number => {
  const str1 = string1?.toUpperCase() || '';
  const str2 = string2?.toUpperCase() || '';

  if (str1 < str2) {
    return -1;
  }

  if (str1 > str2) {
    return 1;
  }

  return 0;
};

export const isUnsignedNumber = (check: string): boolean => {
  const asNumber = +check;
  return Number.isInteger(asNumber) && asNumber >= 0 && check === asNumber.toString();
};

export const toMultiAsset = (asset: AssetId | MultiAssets.NATIVE, api: ApiPromise): MultiAssetId => {
  const value =
    asset === MultiAssets.NATIVE
      ? MultiAssets.NATIVE
      : {
          [MultiAssets.ASSET]: asset,
        };
  return api.createType('PalletAssetConversionMultiAssetId', value);
};

export const multiAssetToParam = (asset: MultiAssetId): string => {
  return asset.isAsset ? asset.asAsset.toString() : 'native';
};

// native always goes first, if there is no native, then we sort assets as numbers
export const getPoolId = (asset1: MultiAssetId, asset2: MultiAssetId): PoolId => {
  if (asset1.isNative) return [asset1, asset2];
  else if (asset2.isNative) return [asset2, asset1];
  else if (asset1.asAsset.toNumber() > asset2.asAsset.toNumber()) return [asset2, asset1];
  else return [asset1, asset2];
};

export const parseAssetParam = (asset: string | undefined, api: ApiPromise): MultiAssetId | null => {
  asset ||= '';
  if (asset.toLowerCase() === 'native') {
    return toMultiAsset(MultiAssets.NATIVE, api);
  } else if (isUnsignedNumber(asset)) {
    return toMultiAsset(api.createType('AssetId', asset), api);
  }
  return null;
};

export const isPoolEmpty = (poolReserves: PoolReserves | undefined): boolean => {
  return !poolReserves || poolReserves?.[0] === BN_ZERO || poolReserves?.[1] === BN_ZERO;
};

export const calcExchangeRate = (
  poolReserves: PoolReserves,
  asset1Decimals: number,
  asset2Decimals: number,
): Decimal => {
  return new Decimal(unitToPlanck('1', asset1Decimals))
    .mul(poolReserves[1].toString())
    .divToInt(poolReserves[0].toString())
    .div(unitToPlanck('1', asset2Decimals));
};

export const calcSwapAmountOut = (
  poolReserves: PoolReserves,
  amountIn: BN,
  assetOutDecimals: number,
  fee: number,
): Decimal => {
  const amountInWithFee = amountIn.mul(new BN(1000 - fee));
  const numerator = amountInWithFee.mul(poolReserves[1]);
  const denominator = poolReserves[0].mul(new BN(1000)).add(amountInWithFee);
  return new Decimal(numerator.toString()).divToInt(denominator.toString()).div(unitToPlanck('1', assetOutDecimals));
};

export const calcSwapAmountIn = (
  poolReserves: PoolReserves,
  amountOut: BN,
  assetInDecimals: number,
  fee: number,
): Decimal | null => {
  if (amountOut.gte(poolReserves[1])) return null;

  const numerator = poolReserves[0].mul(amountOut).mul(new BN(1000));
  const denominator = poolReserves[1].sub(amountOut).mul(new BN(1000 - fee));
  return new Decimal(numerator.toString())
    .divToInt(denominator.toString())
    .add(1)
    .div(unitToPlanck('1', assetInDecimals));
};

const MAX_DECIMAL_POINTS = 5;
export const formatDecimals = (value: Decimal, rounding: Decimal.Rounding = Decimal.ROUND_UP): string => {
  return value.toDP(MAX_DECIMAL_POINTS, Decimal.ROUND_DOWN).toSignificantDigits(6, rounding).toString();
};

export const formatExchangeRate = (value: Decimal): string => {
  const formatted = formatDecimals(value);
  return value.gt(0) && formatted === '0' ? `<0.${'0'.repeat(MAX_DECIMAL_POINTS - 1)}1` : formatted;
};

export const calcPriceImpact = (currentRate: Decimal, idealRate: Decimal): number => {
  return new Decimal(100).sub(currentRate.mul(100).div(idealRate)).toDP(2).toNumber();
};

export const applySlippage = (
  amount: string,
  lowerRange: boolean,
  slippagePercent: number,
  decimals: number,
): string => {
  const slippage = lowerRange ? 100 - slippagePercent : 100 + slippagePercent;
  return new Decimal(amount).mul(slippage).div(100).toDP(decimals).toString();
};

export const getCleanFormattedBalance = (planck: BN, decimals: number): string => {
  return formatBalance(planck as unknown as ToBn, {
    forceUnit: '-',
    decimals,
    withSi: false,
    withZero: false,
  }).replaceAll(',', '');
};

export const areEqualAddresses = (address1: string, address2: string) => {
  if (typeof address1 !== 'string' || typeof address2 !== 'string') {
    return false;
  }

  return address1.toLowerCase() === address2.toLowerCase();
};
