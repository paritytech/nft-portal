import { useEffect, useState } from 'react';

import { ViewAsOptions } from '@helpers/config.ts';

// change this whenever a breaking change is introduced that uses local storage
const LS_VERSION = '1.0.0';

export const LS_KEY_ACCOUNT = 'activeAccount';
export const LS_KEY_CHAIN = 'chain';
export const LS_KEY_UI = 'ui-settings';

export const defaultUiSettings = { viewAs: ViewAsOptions.CARDS };

const LS_KEYS = [LS_KEY_ACCOUNT, LS_KEY_CHAIN, LS_KEY_UI];

export const useLocalStorage = <T>(key: string, initialValue: T | (() => T)): [T, typeof setValue] => {
  const [value, setValue] = useState<T>(() => {
    const storageVersion = localStorage.getItem('version');

    if (storageVersion === null || JSON.parse(storageVersion) !== LS_VERSION) {
      LS_KEYS.forEach((key) => {
        localStorage.removeItem(key);
      });

      localStorage.setItem('version', JSON.stringify(LS_VERSION));
    }

    const jsonValue = localStorage.getItem(key);

    if (jsonValue === null) {
      if (typeof initialValue === 'function') {
        return (initialValue as () => T)();
      } else {
        return initialValue;
      }
    } else {
      return JSON.parse(jsonValue);
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
