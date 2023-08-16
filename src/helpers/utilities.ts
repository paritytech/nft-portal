import { ApiPromise } from '@polkadot/api';
import { BN, formatBalance } from '@polkadot/util';
import { ToBn } from '@polkadot/util/types';
import { FormEvent } from 'react';

import { IPFS_NATIVE_SCHEME } from './config.ts';
import { ALTERNATE_BACKGROUND_CLASSNAME } from './reusableStyles.ts';

export const ellipseAddress = (address = '', charCount = 4): string => {
  if (address === '') {
    return '';
  }

  return `${address.slice(0, charCount)}...${address.slice(-charCount)}`;
};

// the values are flipped to opposite because in the nfts pallet we use bitflags
// where we select what to disable, so in pallet true = disabled, false = enabled
// in order to not confuse users, in UI we use normal logic and then flip values here
export const toBitFlag = (values: boolean[]): number => {
  const bitFlag = values
    .map((value) => +!value)
    .reverse()
    .join('');

  return parseInt(bitFlag, 2);
};

export const toUint8Array = (data: string) => new TextEncoder().encode(data);

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

export const generateNftId = (): number => {
  return Math.floor(Date.now() / 1000);
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

export const handleActionClick = (event: FormEvent, isDisabled?: boolean, action?: () => void) => {
  if (isDisabled) {
    event.preventDefault();
    return;
  }

  if (typeof action !== 'undefined') {
    event.preventDefault();
    action();
  }
};

export const alternateBackground = () => {
  document.body.classList.add(ALTERNATE_BACKGROUND_CLASSNAME);

  return () => document.body.classList.remove(ALTERNATE_BACKGROUND_CLASSNAME);
};

export const getCidUrl = (cid: string) => {
  if (typeof cid !== 'string') {
    return cid;
  }

  return `${IPFS_NATIVE_SCHEME}${cid}`;
};

export const getCidHash = (cid: string) => {
  if (typeof cid !== 'string') {
    return cid;
  }

  if (cid.startsWith(IPFS_NATIVE_SCHEME)) {
    return cid.replace(IPFS_NATIVE_SCHEME, '');
  }

  return cid;
};
