import { Account, BaseWallet } from '@polkadot-onboard/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { chains } from '@helpers/config';
import { ChainThemes } from '@helpers/constants';
import { ActiveAccount, Chain, ThemeStyle } from '@helpers/interfaces';
import { themes } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

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
  setStoredChain: (value: Chain | null) => void;
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
  setStoredChain: () => {},
  theme: themes.kusama,
});

export const useAccounts = () => useContext(AccountsContext);

export const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activeWallet, setActiveWallet] = useState<BaseWallet | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [theme, setTheme] = useState<ThemeStyle>(themes.kusama);
  const [storedActiveAccount, setStoredActiveAccount] = useLocalStorage<ActiveAccount | null>('activeAccount', null);
  const [storedChain, setStoredChain] = useLocalStorage<Chain | null>('chain', null);
  const navigate = useNavigate();

  const setupApi = useCallback(async () => {
    const provider = new WsProvider(storedChain?.url || chains[0].url);
    const unsub = provider.on('error', () => {
      provider.disconnect();
      unsub();
    });
    const api = await ApiPromise.create({ provider });

    setApi(api);
    navigate(routes.collections);
  }, [storedChain, navigate]);

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

  useEffect(() => {
    if (storedChain === null) {
      setStoredChain(chains[0]);
    } else {
      setupApi();
      setupTheme(storedChain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedChain]);

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
      setStoredChain,
      theme,
    }),
    [activeAccount, activeWallet, api, storedActiveAccount, setStoredActiveAccount, setupApi, storedChain, setStoredChain, theme],
  );

  return <AccountsContext.Provider value={contextData}>{children}</AccountsContext.Provider>;
};
