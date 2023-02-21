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

export const normalizePath = (path: string) => {
  const lastChar = path.charAt(path.length - 1);

  if (lastChar === '/') {
    return path.substring(0, path.length - 1);
  }

  return path;
};

// the values are flipped to opposite because in the nfts pallet we use bitflags
// where we select what to disable, so in pallet true = disabled, false = enabled
// in order to not confuse users, in UI we use normal logic and then flip values here
export const convertToBitFlagValue = (values: boolean[]) => {
  const bitFlag = values
    .map((value) => +(!value))
    .reverse()
    .join('');

  return parseInt(bitFlag, 2);
};
