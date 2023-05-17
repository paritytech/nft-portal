import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import '@polkadot/api-augment';
import { BrowserRouter } from 'react-router-dom';

import { AccountsContextProvider } from '@contexts/AccountsContext.tsx';
import { ModalStatusContextProvider } from '@contexts/ModalStatusContext.tsx';

import { APP_NAME, extensionConfig } from '@helpers/config.ts';

import App from './App.tsx';

const injectedWalletProvider = new InjectedWalletProvider(extensionConfig, APP_NAME);
const walletAggregator = new WalletAggregator([injectedWalletProvider]);

const SetupApp = () => (
  <BrowserRouter>
    <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
      <ModalStatusContextProvider>
        <AccountsContextProvider>
          <App />
        </AccountsContextProvider>
      </ModalStatusContextProvider>
    </PolkadotWalletsContextProvider>
  </BrowserRouter>
);

export default SetupApp;
