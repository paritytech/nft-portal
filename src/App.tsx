import { WalletAggregator } from '@polkadot-onboard/core';
import { InjectedWalletProvider } from '@polkadot-onboard/injected-wallets';
import { PolkadotWalletsContextProvider } from '@polkadot-onboard/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import PrivateRoute from '@common/PrivateRoute';
import SideMenu from '@common/SideMenu';

import { AccountsContextProvider } from '@contexts/AccountContext';

import Hat from '@header/Header';

import { APP_NAME, extensionConfig, styleSettings } from '@helpers/config';
import { routes } from '@helpers/routes';

import Home from '@pages/Home/Home';
import CollectionEdit from '@pages/MyNfts/Collections/CollectionEdit';
import CollectionsView from '@pages/MyNfts/Collections/CollectionsView';
import NewNft from '@pages/MyNfts/Nfts/NewNft';
import NftEdit from '@pages/MyNfts/Nfts/NftEdit';
import NftsView from '@pages/MyNfts/Nfts/NftsView';

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
  gap: 30px;
  margin-bottom: 30px;
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
                  path={routes.collections}
                  element={
                    <PrivateRoute>
                      <CollectionsView />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={routes.collectionEdit()}
                  element={
                    <PrivateRoute>
                      <CollectionEdit />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={routes.nfts()}
                  element={
                    <PrivateRoute>
                      <NftsView />
                    </PrivateRoute>
                  }
                />
                <Route
                  path={routes.nftMint()}
                  element={
                    <PrivateRoute>
                      <NewNft />
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
