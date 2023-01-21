import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Account, BaseWallet } from '@polkadot-onboard/core';
import { ApiPromise, WsProvider } from '@polkadot/api';

import { StoredActiveAccount } from '@helpers/interfaces';
import { useLocalStorage } from '@hooks/useLocalStorage';

interface AccountsContextProviderProps {
  children: any;
}

interface AccountsContextProps {
  activeAccount: Account | null;
  activeWallet: BaseWallet | null;
  setActiveAccount: (value: Account) => void;
  setActiveWallet: (wallet: BaseWallet) => void;
  api: ApiPromise | null;
  storedActiveAccount: StoredActiveAccount | null;
  setStoredActiveAccount: (value: StoredActiveAccount) => void;
}

const AccountsContext = createContext<AccountsContextProps>({
  activeAccount: null,
  activeWallet: null,
  setActiveAccount: () => {},
  setActiveWallet: () => {},
  api: null,
  storedActiveAccount: null,
  setStoredActiveAccount: () => {},
});

export const useAccounts = () => useContext(AccountsContext);

export const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activeWallet, setActiveWallet] = useState<BaseWallet | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [storedActiveAccount, setStoredActiveAccount] = useLocalStorage<StoredActiveAccount | null>('activeAccount', null);

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
      activeWallet,
      setActiveAccount,
      setActiveWallet,
      api,
      storedActiveAccount,
      setStoredActiveAccount,
    }),
    [activeAccount, activeWallet, api, storedActiveAccount, setStoredActiveAccount],
  );

  return <AccountsContext.Provider value={contextData}>{children}</AccountsContext.Provider>;
};
