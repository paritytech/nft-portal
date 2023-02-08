import { Account, BaseWallet } from '@polkadot-onboard/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { chains } from '@helpers/config';
import { ActiveAccount, Chain, ThemeStyle } from '@helpers/interfaces';
import { themes } from '@helpers/reusableStyles';

import { useLocalStorage } from '@hooks/useLocalStorage';

interface AccountsContextProviderProps {
  children: any;
}

interface AccountsContextProps {
  activeAccount: Account | null;
  activeWallet: BaseWallet | null;
  setActiveAccount: (value: Account) => void;
  setActiveWallet: (value: BaseWallet) => void;
  api: ApiPromise | null;
  storedActiveAccount: ActiveAccount | null;
  setStoredActiveAccount: (value: ActiveAccount) => void;
  setupApi: (value: Chain) => void;
  storedChain: Chain | null;
  theme: ThemeStyle;
}

const AccountsContext = createContext<AccountsContextProps>({
  activeAccount: null,
  activeWallet: null,
  setActiveAccount: () => {},
  setActiveWallet: () => {},
  api: null,
  storedActiveAccount: null,
  setStoredActiveAccount: () => {},
  setupApi: () => {},
  storedChain: null,
  theme: themes.kusama,
});

export const useAccounts = () => useContext(AccountsContext);

export const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activeWallet, setActiveWallet] = useState<BaseWallet | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [storedActiveAccount, setStoredActiveAccount] = useLocalStorage<ActiveAccount | null>('activeAccount', null);
  const [storedChain, setStoredChain] = useLocalStorage<Chain | null>('chain', null);
  const [theme, setTheme] = useState<ThemeStyle>(themes.kusama);

  const setupApi = useCallback(
    async (chain: Chain) => {
      const provider = new WsProvider(chain.url);
      const unsub = provider.on('error', () => {
        provider.disconnect();
        unsub();
      });
      const api = await ApiPromise.create({ provider });

      setStoredChain(chain);
      setApi(api);
    },
    [setStoredChain],
  );

  const setupTheme = useCallback((chain: Chain) => {
    switch (chain.theme) {
      case 'kusama':
        setTheme(themes.kusama);
        break;
      case 'polkadot':
        setTheme(themes.polkadot);
        break;
      default:
        setTheme(themes.kusama);
    }
  }, []);

  useEffect(() => {
    setupApi(storedChain || chains[0]);
    setupTheme(storedChain || chains[0]);
  }, [setupApi, setupTheme, storedChain]);

  const contextData = useMemo(
    () => ({
      activeAccount,
      activeWallet,
      setActiveAccount,
      setActiveWallet,
      api,
      storedActiveAccount,
      setStoredActiveAccount,
      setupApi,
      storedChain,
      theme,
    }),
    [activeAccount, activeWallet, api, storedActiveAccount, setStoredActiveAccount, setupApi, storedChain, theme],
  );

  return <AccountsContext.Provider value={contextData}>{children}</AccountsContext.Provider>;
};
