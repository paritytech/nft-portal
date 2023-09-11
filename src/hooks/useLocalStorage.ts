import { useEffect, useState } from 'react';

import { ViewAsOptions } from '@helpers/config.ts';

// change this whenever a breaking change is introduced that uses local storage
const LOCAL_STORAGE_VERSION = '1.0.0';

export const defaultUISettings = { viewAs: ViewAsOptions.CARDS };

export enum LocalStorageKeys {
  LSK_ACCOUNT = 'ACCOUNT',
  LSK_CHAIN = 'CHAIN',
  LSK_UI_SETTINGS = 'UI_SETTINGS',
  LSK_VERSION = 'VERSION',
}

export const useLocalStorage = <T>(key: string, initialValue: T | (() => T)): [T, typeof setValue] => {
  const [value, setValue] = useState<T>(() => {
    const storageVersion = localStorage.getItem(LocalStorageKeys.LSK_VERSION);

    if (storageVersion === null || JSON.parse(storageVersion) !== LOCAL_STORAGE_VERSION) {
      Object.keys(LocalStorageKeys).forEach((key) => {
        localStorage.removeItem(key);
      });

      localStorage.setItem(LocalStorageKeys.LSK_VERSION, JSON.stringify(LOCAL_STORAGE_VERSION));
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
