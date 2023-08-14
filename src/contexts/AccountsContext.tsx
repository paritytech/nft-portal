import type { Account, BaseWallet } from '@polkadot-onboard/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { chains } from '@helpers/config.ts';
import { ChainThemes } from '@helpers/constants.ts';
import { ActiveAccount, Chain, ThemeStyle } from '@helpers/interfaces.ts';
import { themes } from '@helpers/reusableStyles.ts';

import { useLocalStorage } from '@hooks/useLocalStorage.ts';

interface AccountsContextProviderProps {
  children: ReactElement;
}

interface AccountsContextProps {
  activeAccount: Account | null;
  activeWallet: BaseWallet | null;
  api: ApiPromise | null;
  availableAccounts: Account[] | null;
  isAccountActionsVisible: boolean;
  onWalletDisconnect: () => void;
  setActiveAccount: (value: Account | null) => void;
  setActiveWallet: (value: BaseWallet) => void;
  setAvailableAccounts: (value: Account[] | null) => void;
  setIsAccountActionsVisible: (value: boolean) => void;
  setStoredActiveAccount: (value: ActiveAccount | null) => void;
  setStoredChain: (value: Chain | null) => void;
  storedActiveAccount: ActiveAccount | null;
  storedChain: Chain | null;
}

const AccountsContext = createContext<AccountsContextProps>(undefined!);

export const useAccounts = () => useContext(AccountsContext);

export const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
  const [availableAccounts, setAvailableAccounts] = useState<Account[] | null>(null);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activeWallet, setActiveWallet] = useState<BaseWallet | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [theme, setTheme] = useState<ThemeStyle>(themes.polkadot);
  const [storedActiveAccount, setStoredActiveAccount] = useLocalStorage<ActiveAccount | null>('activeAccount', null);
  const [storedChain, setStoredChain] = useLocalStorage<Chain | null>('chain', null);
  const [isAccountActionsVisible, setIsAccountActionsVisible] = useState(false);

  const setupApi = useCallback(async () => {
    const chain = storedChain || chains[0];
    const provider = new WsProvider(chain.url);
    const unsub = provider.on('error', () => {
      provider.disconnect();
      unsub();
    });
    const api = await ApiPromise.create({ provider });

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
        setTheme(themes.polkadot);
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

  const onWalletDisconnect = useCallback(() => {
    activeWallet?.disconnect();
    setActiveAccount(null);
    setActiveWallet(null);
    setStoredActiveAccount(null);
    setIsAccountActionsVisible(false);
  }, [activeWallet, setStoredActiveAccount]);

  useEffect(() => {
    handleChainChange();
  }, [handleChainChange, storedChain]);

  const contextData = useMemo(
    () => ({
      activeAccount,
      activeWallet,
      api,
      availableAccounts,
      isAccountActionsVisible,
      onWalletDisconnect,
      setActiveAccount,
      setActiveWallet,
      setAvailableAccounts,
      setIsAccountActionsVisible,
      setStoredActiveAccount,
      setStoredChain,
      storedActiveAccount,
      storedChain,
    }),
    [
      activeAccount,
      activeWallet,
      api,
      availableAccounts,
      isAccountActionsVisible,
      onWalletDisconnect,
      setActiveAccount,
      setActiveWallet,
      setAvailableAccounts,
      setIsAccountActionsVisible,
      setStoredActiveAccount,
      setStoredChain,
      storedActiveAccount,
      storedChain,
    ],
  );

  return (
    <AccountsContext.Provider value={contextData}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AccountsContext.Provider>
  );
};
