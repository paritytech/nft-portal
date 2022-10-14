import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';

import { Hat, Home } from './components/Main';
import { APP_NAME, extensionConfig, routes, styleSettings } from './constants';
import { AccountsContextProvider } from './Contexts';

const SMainContainer = styled.div`
  padding-top: 20px;
  margin: 0 20px;

  @media ${styleSettings.mediaQueries.tablet} {
    width: 728px;
    margin: 0 auto;
  }

  @media ${styleSettings.mediaQueries.desktop} {
    width: 984px;
  }
`;

let injectedWalletProvider = new InjectedWalletProvider(extensionConfig, APP_NAME);
let walletAggregator = new WalletAggregator([injectedWalletProvider]);

const App = () => (
  <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
    <AccountsContextProvider>
      <BrowserRouter>
        <SMainContainer>
          <Hat />
          <Routes>
            <Route path={routes.homepage} element={<Home />} />
            <Route path='*' element={<Navigate to={routes.homepage} replace />} />
          </Routes>
        </SMainContainer>
      </BrowserRouter>
    </AccountsContextProvider>
  </PolkadotWalletsContextProvider>
);

export default App;
