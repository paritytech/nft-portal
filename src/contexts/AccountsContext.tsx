import { Account, BaseWallet } from '@polkadot-onboard/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { apiConfigRuntime, apiConfigTypes, chains } from '@helpers/config';
import { ChainThemes } from '@helpers/constants';
import { ActiveAccount, Chain, ThemeStyle } from '@helpers/interfaces';
import { themes } from '@helpers/reusableStyles';

import { useLocalStorage } from '@hooks/useLocalStorage';

interface AccountsContextProviderProps {
  children: ReactElement;
}

interface AccountsContextProps {
  availableAccounts: Account[] | null;
  activeAccount: Account | null;
  activeChain: Chain | null;
  activeWallet: BaseWallet | null;
  setAvailableAccounts: (value: Account[] | null) => void;
  setActiveAccount: (value: Account | null) => void;
  setActiveWallet: (value: BaseWallet) => void;
  api: ApiPromise | null;
  storedActiveAccount: ActiveAccount | null;
  setStoredActiveAccount: (value: ActiveAccount | null) => void;
  storedChain: Chain | null;
  setStoredChain: (value: Chain | null) => void;
}

/* eslint-disable @typescript-eslint/no-empty-function */
const AccountsContext = createContext<AccountsContextProps>({
  availableAccounts: null,
  activeAccount: null,
  activeChain: null,
  activeWallet: null,
  setAvailableAccounts: () => {},
  setActiveAccount: () => {},
  setActiveWallet: () => {},
  api: null,
  storedActiveAccount: null,
  setStoredActiveAccount: () => {},
  storedChain: null,
  setStoredChain: () => {},
});
/* eslint-enable @typescript-eslint/no-empty-function */

export const useAccounts = () => useContext(AccountsContext);

export const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
  const [availableAccounts, setAvailableAccounts] = useState<Account[] | null>(null);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activeChain, setActiveChain] = useState<Chain | null>(null);
  const [activeWallet, setActiveWallet] = useState<BaseWallet | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [theme, setTheme] = useState<ThemeStyle>(themes.kusama);
  const [storedActiveAccount, setStoredActiveAccount] = useLocalStorage<ActiveAccount | null>('activeAccount', null);
  const [storedChain, setStoredChain] = useLocalStorage<Chain | null>('chain', null);

  const setupApi = useCallback(async () => {
    const chain = storedChain || chains[0];
    const provider = new WsProvider(chain.url);
    const unsub = provider.on('error', () => {
      provider.disconnect();
      unsub();
    });
    const api = await ApiPromise.create({ provider, typesBundle: apiConfigRuntime, types: apiConfigTypes });
    setActiveChain(chain);
    setApi(api);
  }, [storedChain]);

  const setupTheme = useCallback((chain: Chain) => {
    switch (chain.theme) {
      case ChainThemes.KUSAMA:
        setTheme(themes.kusama);
        break;
      case ChainThemes.POLKADOT:
        setTheme(themes.polkadot);
        break;
      default:
        setTheme(themes.kusama);
    }
  }, []);

  const handleChainChange = useCallback(async () => {
    if (storedChain === null) {
      setStoredChain(chains[0]);
    } else {
      await setupApi();
      setupTheme(storedChain);
    }
  }, [setStoredChain, setupApi, setupTheme, storedChain]);

  useEffect(() => {
    handleChainChange();
  }, [handleChainChange, storedChain]);

  const contextData = useMemo(
    () => ({
      availableAccounts,
      activeAccount,
      activeChain,
      activeWallet,
      setAvailableAccounts,
      setActiveAccount,
      setActiveWallet,
      api,
      storedActiveAccount,
      setStoredActiveAccount,
      storedChain,
      setStoredChain,
    }),
    [
      availableAccounts,
      activeAccount,
      activeChain,
      activeWallet,
      setAvailableAccounts,
      api,
      storedActiveAccount,
      setStoredActiveAccount,
      storedChain,
      setStoredChain,
    ],
  );

  return (
    <AccountsContext.Provider value={contextData}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AccountsContext.Provider>
  );
};
