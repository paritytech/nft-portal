import { Account } from '@polkadot-onboard/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { StorageKey, u32 } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';

import { gatherUniqueCollectionIds } from '../helpers';

interface AccountsContextProviderProps {
  children: any;
}

interface AccountsContextProps {
  activeAccount: Account | null;
  setActiveAccount: (value: Account) => void;
  api: ApiPromise | null;
  getAccountCollectionsIds: () => Promise<string[]>;
}

const AccountsContext = createContext<AccountsContextProps>({
  activeAccount: null,
  setActiveAccount: () => {},
  api: null,
  getAccountCollectionsIds: async () => [],
});

export const useAccounts = () => useContext(AccountsContext);

export const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);

  useEffect(() => {
    const setupApi = async () => {
      const provider = new WsProvider('ws://127.0.0.1:9944');
      const api = await ApiPromise.create({ provider });

      setApi(api);
    };

    if (activeAccount) {
      setupApi();
    }
  }, [activeAccount]);

  const getAccountCollectionsIds = useCallback(async () => {
    if (api && activeAccount) {
      const accountKeys = (await api.query.uniques.account.keys()) as unknown as StorageKey<[AccountId32, u32, u32]>[];
      const ids = gatherUniqueCollectionIds(accountKeys);

      return ids;
    }

    return [];
  }, [api, activeAccount]);

  const contextData = useMemo(
    () => ({
      activeAccount,
      setActiveAccount,
      api,
      getAccountCollectionsIds,
    }),
    [activeAccount, api, getAccountCollectionsIds],
  );

  return <AccountsContext.Provider value={contextData}>{children}</AccountsContext.Provider>;
};
