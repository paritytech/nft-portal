import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import { WalletConnectProvider } from '@polkadot-onboard/wallet-connect';
import { useEffect, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { APP_NAME, extensionConfig, walletConnectParams } from '@helpers/config.ts';

import App from './App.tsx';

const SetupWallets = () => {
  const { onWalletDisconnect } = useAccounts();
  const [walletAggregator, setWalletAggregator] = useState<WalletAggregator>();

  useEffect(() => {
    document.querySelector('wcm-modal')?.remove();
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
