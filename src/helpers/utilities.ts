import { ApiPromise } from '@polkadot/api';
import { BN, BN_ZERO, formatBalance } from '@polkadot/util';
import { ToBn } from '@polkadot/util/types';
import { Decimal } from 'decimal.js';

import { MultiAssets } from '@helpers/constants';
import { PalletAssetConversionMultiAssetId, PoolReserves } from '@helpers/interfaces';

export const ellipseAddress = (address = '', width = 10): string => {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
};

export const sizeMatters = (yourThing: string | undefined | null, size = 16) => {
  if (typeof yourThing === 'string') {
    if (yourThing.length > size) {
      return `${yourThing.slice(0, size)}...`;
    } else {
      return yourThing;
    }
  }

  return '';
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

export const unitToPlanck = (units: string, decimals: number): string => {
  const separated = units.split('.');
  const [whole] = separated;
  let [, decimal] = separated;

  if (typeof decimal === 'undefined') {
    decimal = '';
  }

  return `${whole}${decimal.padEnd(decimals, '0')}`.replace(/^0+/, '');
};

export const addSlippage = (value: string, slippage: number): string => {
  return new Decimal(100).minus(slippage).div(100).mul(value).toString();
};

export const generateAssetId = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const sortStrings = (string1: string | null, string2: string | null): number => {
  string1 = string1?.toUpperCase();
  string2 = string2?.toUpperCase();
  if (string1 < string2) {
    return -1;
  }
  if (string1 > string2) {
    return 1;
  }
  return 0;
};

export const isUnsignedNumber = (check: string): boolean => {
  const asNumber = +check;
  return Number.isInteger(asNumber) && asNumber >= 0 && check === asNumber.toString();
};

export const constructMultiAsset = (assetId: string, api: ApiPromise): PalletAssetConversionMultiAssetId | null => {
  if (assetId === 'native') {
    return api.createType('PalletAssetConversionMultiAssetId', MultiAssets.NATIVE);
  } else if (isUnsignedNumber(assetId)) {
    return api.createType('PalletAssetConversionMultiAssetId', {
      [MultiAssets.ASSET]: api.createType('AssetId', assetId),
    });
  }
  return null;
};

export const isPoolEmpty = (poolReserves: PoolReserves | undefined): boolean => {
  return poolReserves?.[0] === BN_ZERO && poolReserves?.[1] === BN_ZERO;
};

export const calcExchangeRate = (amount1: number, amount2: number): Decimal | null => {
  if (amount1 === 0 || amount2 === 0) return null;
  return new Decimal(amount2).div(new Decimal(amount1));
};

export const formatDecimals = (value: Decimal): string => {
  return value.toSignificantDigits(6, Decimal.ROUND_UP).toString();
};

export const getCleanFormattedBalance = (planck: BN, decimals: number): string => {
  return formatBalance(planck as ToBn, {
    forceUnit: '-',
    decimals,
    withSi: false,
    withZero: false,
  }).replaceAll(',', '');
};
