import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import '@polkadot/api-augment';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import { AccountsContextProvider } from '@contexts/AccountsContext';
import { ModalStatusContextProvider } from '@contexts/ModalStatusContext';

import { APP_NAME, extensionConfig } from '@helpers/config';

import App from './App';

const injectedWalletProvider = new InjectedWalletProvider(extensionConfig, APP_NAME);
const walletAggregator = new WalletAggregator([injectedWalletProvider]);

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
  }
`;

const SetupApp = () => (
  <BrowserRouter>
    <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
      <ModalStatusContextProvider>
        <AccountsContextProvider>
          <GlobalStyle />
          <App />
        </AccountsContextProvider>
      </ModalStatusContextProvider>
    </PolkadotWalletsContextProvider>
  </BrowserRouter>
);

export default SetupApp;
