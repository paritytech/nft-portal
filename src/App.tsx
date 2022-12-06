import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';

import { Hat, Home, PrivateRoute, SideMenu } from './components/Main';
import { APP_NAME, extensionConfig, routes, styleSettings } from './constants';
import { AccountsContextProvider } from './Contexts';
import { NftCollections, NftCollectionEdit, NftMint, Nfts, NftEdit } from './components/MyCollection';
import { NewCollection } from './components/NewCollection';

const SMainContainer = styled.main`
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

const SContent = styled.section`
  width: 100%;
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
            <SContent>
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
                  path={routes.nftCollectionEdit()}
                  element={
                    <PrivateRoute>
                      <NftCollectionEdit />
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
                  path={routes.ownedNfts()}
                  element={
                    <PrivateRoute>
                      <Nfts />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={routes.nftMint()}
                  element={
                    <PrivateRoute>
                      <NftMint />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={routes.nftEdit()}
                  element={
                    <PrivateRoute>
                      <NftEdit />
                    </PrivateRoute>
                  }
                />
                <Route path='*' element={<Navigate to={routes.homepage} replace />} />
              </Routes>
            </SContent>
          </SContainer>
        </SMainContainer>
      </BrowserRouter>
    </AccountsContextProvider>
  </PolkadotWalletsContextProvider>
);

export default App;
