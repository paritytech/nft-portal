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
import ValidateAddLiquidity from '@pages/Assets/Pools/ValidateAddLiquidity';
import Tokens from '@pages/Assets/Tokens/Tokens';
import Discover from '@pages/Discover/Discover';
import MyAssets from '@pages/MyAssets/MyAssets';
import NewNftMint from '@pages/MyAssets/NftMint/NewNftMint';
import MyPools from '@pages/MyAssets/Pools/MyPools';
import PoolCreate from '@pages/MyAssets/Pools/PoolCreate';
import CollectionEdit from '@pages/Nfts/Collections/CollectionEdit';
import CollectionMint from '@pages/Nfts/Collections/CollectionMint';
import Collections from '@pages/Nfts/Collections/Collections';
import NftEdit from '@pages/Nfts/Nfts/NftEdit';
import NftMint from '@pages/Nfts/Nfts/NftMint';
import Nfts from '@pages/Nfts/Nfts/Nfts';
import Swap from '@pages/Swap/Swap';

const SMainContainer = styled.main<Themeable>`
  color: ${({ activeTheme }) => activeTheme.textAndIconsPrimary};
  margin: 0 auto;

  @media ${styleSettings.mediaQueries.tablet} {
    width: 728px;
  }

  @media ${styleSettings.mediaQueries.desktop} {
    width: 1250px;
  }
`;

const App = () => {
  const { theme } = useAccounts();

  const GlobalStyle = createGlobalStyle`
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      font-weight: 400;
      background-color: ${theme.backgroundSystem};
      color: ${theme.textAndIconsSecondary};
    }
  `;

  return (
    <>
      <GlobalStyle />
      <Header />
      <SMainContainer activeTheme={theme}>
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

            <Route path={routes.myAssets.newNftMint} element={<NewNftMint />}>
              <Route
                path={routes.myAssets.selectCollection}
                element={
                  <PrivateRoute>
                    <div>under construction</div>
                  </PrivateRoute>
                }
              />
            </Route>

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

            <Route path={routes.myAssets.pools} element={<Outlet />}>
              <Route
                index
                element={
                  <PrivateRoute>
                    <MyPools />
                  </PrivateRoute>
                }
              />

              <Route
                path={routes.myAssets.poolCreate}
                element={
                  <PrivateRoute redirectTo={routes.discover.pools}>
                    <PoolCreate />
                  </PrivateRoute>
                }
              />
            </Route>
          </Route>

          <Route path={routes.discover.index} element={<Outlet />}>
            <Route index element={<Discover />} />
            <Route path={routes.discover.tokens} element={<Tokens />} />
            <Route path={routes.discover.pools} element={<Outlet />}>
              <Route index element={<Pools />} />
              <Route path={routes.discover.addLiquidity()} element={<ValidateAddLiquidity />} />
            </Route>
          </Route>

          <Route path={routes.swap.index} element={<Outlet />}>
            <Route index element={<Swap />} />
          </Route>

          <Route path='*' element={<Navigate to={routes.homepage} replace />} />
        </Routes>
      </SMainContainer>
    </>
  );
};

export default App;
