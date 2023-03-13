import { ApiPromise } from '@polkadot/api';

export const ellipseAddress = (address: string = '', width: number = 10): string => {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
};

export const sizeMatters = (yourThing: string | undefined | null, size: number = 16) => {
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
export const convertToBitFlagValue = (values: boolean[]) => {
  const bitFlag = values
    .map((value) => +!value)
    .reverse()
    .join('');

  return parseInt(bitFlag, 2);
};

export const getBlockNumber = async (api: ApiPromise, timestamp?: number) => {
  if (typeof timestamp === 'undefined') {
    return timestamp;
  }

  const blockTime = (api.consts.babe.expectedBlockTime.toPrimitive() as number) / 1000; // in seconds
  const activeBlockNumber = (await api.derive.chain.bestNumber()).toNumber();

  const currentDate = Math.floor(Date.now() / 1000); // current timestamp in seconds
  const laterDate = Math.floor(timestamp / 1000); // user provided timestamp in seconds

  return Math.floor((laterDate - currentDate) / blockTime + activeBlockNumber);
};

export const pricePattern = (maxPrecision: number) => `^(0|[1-9][0-9]*)([.][0-9]{0,${maxPrecision}})?$`;

export const unitToPlanck = (units: string, decimals: number) => {
  let [whole, decimal] = units.split('.');

  if (typeof decimal === 'undefined') {
    decimal = '';
  }

  return `${whole}${decimal.padEnd(decimals, '0')}`.replace(/^0+/, '');
};
