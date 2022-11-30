import { Account } from '@polkadot-onboard/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AccountsContextProviderProps {
  children: any;
}

interface AccountsContextProps {
  activeAccount: Account | null;
  setActiveAccount: (value: Account) => void;
  api: ApiPromise | null;
}

const AccountsContext = createContext<AccountsContextProps>({
  activeAccount: null,
  setActiveAccount: () => {},
  api: null,
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

  const contextData = useMemo(
    () => ({
      activeAccount,
      setActiveAccount,
      api,
    }),
    [activeAccount, api],
  );

  return <AccountsContext.Provider value={contextData}>{children}</AccountsContext.Provider>;
};
