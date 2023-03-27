import '@polkadot/api-augment';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import PrivateRoute from '@common/PrivateRoute';

import { useAccounts } from '@contexts/AccountsContext';

import Header from '@header/Header';

import { Themeable } from '@helpers/interfaces';
import { styleSettings } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

import Pools from '@pages/Assets/Pools/Pools';
import Tokens from '@pages/Assets/Tokens/Tokens';
import Discover from '@pages/Discover/Discover';
import MyAssets from '@pages/MyAssets/MyAssets';
import CollectionEdit from '@pages/Nfts/Collections/CollectionEdit';
import CollectionMint from '@pages/Nfts/Collections/CollectionMint';
import Collections from '@pages/Nfts/Collections/Collections';
import NftEdit from '@pages/Nfts/Nfts/NftEdit';
import NftMint from '@pages/Nfts/Nfts/NftMint';
import Nfts from '@pages/Nfts/Nfts/Nfts';
import Swap from '@pages/Swap/Swap';

const SMainContainer = styled.main<Themeable>`
  padding-top: 20px;
  margin: 0 20px;
  color: ${({ activeTheme }) => activeTheme.defaultTextColor};

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

const App = () => {
  const { theme } = useAccounts();

  const GlobalStyle = createGlobalStyle`
    body {
      margin: 0;
      padding: 0;
      background-color: ${theme.bodyBackground};
    }
  `;

  return (
    <>
      <GlobalStyle />
      <SMainContainer activeTheme={theme}>
        <Header />
        <SContainer>
          <SContent>
            <Routes>
              <Route path={routes.myAssets.index} element={<Outlet />}>
                <Route
                  index
                  element={
                    <PrivateRoute>
                      <MyAssets />
                    </PrivateRoute>
                  }
                />
                <Route path={routes.myAssets.collections} element={<Outlet />}>
                  <Route
                    index
                    element={
                      <PrivateRoute>
                        <Collections />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={routes.myAssets.collectionMint}
                    element={
                      <PrivateRoute redirectTo={routes.myAssets.collections}>
                        <CollectionMint />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path={routes.myAssets.collectionEdit()}
                    element={
                      <PrivateRoute redirectTo={routes.myAssets.collections}>
                        <CollectionEdit />
                      </PrivateRoute>
                    }
                  />
                  <Route path={routes.myAssets.nfts()} element={<Outlet />}>
                    <Route
                      index
                      element={
                        <PrivateRoute redirectTo={routes.myAssets.collections}>
                          <Nfts />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path={routes.myAssets.nftMint()}
                      element={
                        <PrivateRoute redirectTo={routes.myAssets.collections}>
                          <NftMint />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path={routes.myAssets.nftEdit()}
                      element={
                        <PrivateRoute redirectTo={routes.myAssets.collections}>
                          <NftEdit />
                        </PrivateRoute>
                      }
                    />
                  </Route>
                </Route>
              </Route>

              <Route path={routes.discover.index} element={<Outlet />}>
                <Route index element={<Discover />} />
                <Route path={routes.discover.tokens} element={<Tokens />} />
                <Route path={routes.discover.pools} element={<Pools />} />
              </Route>

              <Route path={routes.swap.index} element={<Outlet />}>
                <Route index element={<Swap />} />
              </Route>

              <Route path='*' element={<Navigate to={routes.homepage} replace />} />
            </Routes>
          </SContent>
        </SContainer>
      </SMainContainer>
    </>
  );
};

export default App;
