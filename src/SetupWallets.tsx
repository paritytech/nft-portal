import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import { useEffect, useState } from 'react';

// TODO update @polkadot-onboard/wallet-connect library with this code
import { WalletConnectProvider } from '@common/WalletConnect/wallet-connect.ts';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { APP_NAME, extensionConfig, walletConnectParams } from '@helpers/config.ts';

import App from './App.tsx';

const SetupWallets = () => {
  const { onWalletDisconnect } = useAccounts();
  const [walletAggregator, setWalletAggregator] = useState<WalletAggregator>();

  useEffect(() => {
    walletConnectParams.onSessionDelete = onWalletDisconnect;
    const injectedWalletProvider = new InjectedWalletProvider(extensionConfig, APP_NAME);
    const walletConnectProvider = new WalletConnectProvider(walletConnectParams, APP_NAME);

    setWalletAggregator(new WalletAggregator([injectedWalletProvider, walletConnectProvider]));
  }, [onWalletDisconnect]);

  if (!walletAggregator) {
    return null;
  }

  return (
    <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
      <App />
    </PolkadotWalletsContextProvider>
  );
};

export default SetupWallets;
