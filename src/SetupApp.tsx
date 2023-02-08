import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import App from 'App';

import { AccountsContextProvider } from '@contexts/AccountsContext';
import { ModalStatusContextProvider } from '@contexts/ModalStatusContext';

import { APP_NAME, extensionConfig } from '@helpers/config';

let injectedWalletProvider = new InjectedWalletProvider(extensionConfig, APP_NAME);
let walletAggregator = new WalletAggregator([injectedWalletProvider]);

const SetupApp = () => (
  <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
    <ModalStatusContextProvider>
      <AccountsContextProvider>
        <App />
      </AccountsContextProvider>
    </ModalStatusContextProvider>
  </PolkadotWalletsContextProvider>
);

export default SetupApp;
