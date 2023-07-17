import { local } from '@capi/local';
import type { Account, BaseWallet } from '@polkadot-onboard/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Chain as CapiChain, ExtrinsicSender, FrameMetadata, ValueRune } from 'capi';
import { pjsSender } from 'capi/patterns/compat/pjs_sender';
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
  availableAccounts: Account[] | null;
  activeAccount: Account | null;
  activeWallet: BaseWallet | null;
  setAvailableAccounts: (value: Account[] | null) => void;
  setActiveAccount: (value: Account | null) => void;
  setActiveWallet: (value: BaseWallet) => void;
  api: ApiPromise | null;
  sender?: ValueRune<ExtrinsicSender<CapiChain<FrameMetadata>>>;
  storedActiveAccount: ActiveAccount | null;
  setStoredActiveAccount: (value: ActiveAccount | null) => void;
  storedChain: Chain | null;
  setStoredChain: (value: Chain | null) => void;
}

const AccountsContext = createContext<AccountsContextProps>(undefined!);

export const useAccounts = () => useContext(AccountsContext);

export const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
  const [availableAccounts, setAvailableAccounts] = useState<Account[] | null>(null);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activeWallet, setActiveWallet] = useState<BaseWallet | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [sender, setSender] = useState<ValueRune<ExtrinsicSender<CapiChain<FrameMetadata>>>>();
  const [theme, setTheme] = useState<ThemeStyle>(themes.polkadot);
  const [storedActiveAccount, setStoredActiveAccount] = useLocalStorage<ActiveAccount | null>('activeAccount', null);
  const [storedChain, setStoredChain] = useLocalStorage<Chain | null>('chain', null);

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

  useEffect(() => {
    handleChainChange();
  }, [handleChainChange, storedChain]);

  useEffect(() => {
    const setupSender = () => {
      if (activeWallet?.signer && activeAccount) {
        // TODO take dynamically the correct capi instance
        setSender(pjsSender(local, activeWallet.signer)(activeAccount.address));
      }
    };

    setupSender();
  }, [activeWallet, activeAccount]);

  const contextData = useMemo(
    () => ({
      availableAccounts,
      activeAccount,
      activeWallet,
      setAvailableAccounts,
      setActiveAccount,
      setActiveWallet,
      api,
      sender,
      storedActiveAccount,
      setStoredActiveAccount,
      storedChain,
      setStoredChain,
    }),
    [
      availableAccounts,
      activeAccount,
      activeWallet,
      setAvailableAccounts,
      api,
      sender,
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
