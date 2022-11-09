import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';

import { Hat, Home, PrivateRoute, SideMenu } from './components/Main';
import { APP_NAME, extensionConfig, routes, styleSettings } from './constants';
import { AccountsContextProvider } from './Contexts';
import { NftCollections } from './components/NftCollections';
import { NewCollection } from './components/NewCollection';
import { MintNft } from './components/MintNft';

const SMainContainer = styled.div`
  padding-top: 20px;
  margin: 0 20px;
  color: ${styleSettings.colors.shark};

  @media ${styleSettings.mediaQueries.tablet} {
    width: 728px;
    margin: 0 auto;
  }

  @media ${styleSettings.mediaQueries.desktop} {
    width: 984px;
  }
`;

const SContainer = styled.div`
  display: flex;
  gap: 40px;
`;

let injectedWalletProvider = new InjectedWalletProvider(extensionConfig, APP_NAME);
let walletAggregator = new WalletAggregator([injectedWalletProvider]);

const App = () => (
  <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
    <AccountsContextProvider>
      <BrowserRouter>
        <SMainContainer>
          <Hat />
          <SContainer>
            <SideMenu />
            <Routes>
              <Route path={routes.homepage} element={<Home />} />
              <Route
                path={routes.nftCollections}
                element={
                  <PrivateRoute>
                    <NftCollections />
                  </PrivateRoute>
                }
              />
              <Route
                path={routes.newCollection}
                element={
                  <PrivateRoute>
                    <NewCollection />
                  </PrivateRoute>
                }
              />
              <Route
                path={routes.mintNft}
                element={
                  <PrivateRoute>
                    <MintNft />
                  </PrivateRoute>
                }
              />
              <Route path='*' element={<Navigate to={routes.homepage} replace />} />
            </Routes>
          </SContainer>
        </SMainContainer>
      </BrowserRouter>
    </AccountsContextProvider>
  </PolkadotWalletsContextProvider>
);

export default App;
