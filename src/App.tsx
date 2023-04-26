import '@polkadot/api-augment';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import PrivateRoute from '@common/PrivateRoute';
import Title from '@common/Title';

import Header from '@header/Header';

import { ThemeStyle } from '@helpers/interfaces';
import { CLEAN_BACKGROUND_CLASSNAME, mediaQueries } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

import Drops from '@pages/Assets/Nfts/Drops';
import Nfts from '@pages/Assets/Nfts/Nfts';
import Pools from '@pages/Assets/Pools/Pools';
import ValidateAddLiquidity from '@pages/Assets/Pools/ValidateAddLiquidity';
import Tokens from '@pages/Assets/Tokens/Tokens';
import Discover from '@pages/Discover/Discover';
import CreateCollection from '@pages/MyAssets/MintNft/CreateCollection';
import LoadCollectionsData from '@pages/MyAssets/MintNft/LoadCollectionsData';
import MintNft from '@pages/MyAssets/MintNft/MintNft';
import MintNftIndex from '@pages/MyAssets/MintNft/MintNftIndex';
import MyAssets from '@pages/MyAssets/MyAssets';
import CreatePool from '@pages/MyAssets/Pools/CreatePool';
import MyPools from '@pages/MyAssets/Pools/MyPools';
import CollectionEdit from '@pages/Nfts/Collections/CollectionEdit';
import Collections from '@pages/Nfts/Collections/Collections';
import NftEdit from '@pages/Nfts/Nfts/NftEdit';
import MyNfts from '@pages/Nfts/Nfts/Nfts';
import Swap from '@pages/Swap/Swap';

const SMainContainer = styled.main`
  color: ${({ theme }) => theme.textAndIconsPrimary};
  margin: 0 auto;

  @media ${mediaQueries.tablet} {
    width: 854px;
  }

  @media ${mediaQueries.desktop} {
    width: 1250px;
  }
`;

const GlobalStyle = createGlobalStyle<{ theme: ThemeStyle }>`
  html, body {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 16px 0 0;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    background: radial-gradient(50% 50% at 50% 50%, #D43079 0%, rgba(212, 48, 121, 0.24) 0.01%, rgba(16, 16, 21, 0) 100%) 
    ${({ theme }) => theme.backgroundSystem};
    color: ${({ theme }) => theme.textAndIconsSecondary};

    &.${CLEAN_BACKGROUND_CLASSNAME} {
      background: ${({ theme }) => theme.backgroundSystem};
    }
  }

  .modal-backdrop {
    background-color: ${({ theme }) => theme.appliedOverlay};

    &.show {
      opacity: 1;
    }
  }
`;

const App = () => (
  <>
    <GlobalStyle />
    <Header />
    <SMainContainer>
      <Routes>
        <Route path={routes.myAssets.index} element={<Outlet />}>
          <Route
            index
            element={
              <>
                <Title className='XXL'>My Assets</Title>
                <PrivateRoute>
                  <MyAssets />
                </PrivateRoute>
              </>
            }
          />

          <Route path={routes.myAssets.mintNftMain} element={<MintNftIndex />}>
            <Route
              index
              element={
                <PrivateRoute>
                  <LoadCollectionsData />
                </PrivateRoute>
              }
            />

            <Route
              path={routes.myAssets.createCollection}
              element={
                <PrivateRoute>
                  <CreateCollection />
                </PrivateRoute>
              }
            />

            <Route
              path={routes.myAssets.mintNft()}
              element={
                <PrivateRoute>
                  <MintNft />
                </PrivateRoute>
              }
            />
          </Route>

          <Route path={routes.myAssets.collections} element={<Outlet />}>
            <Route
              index
              element={
                <>
                  <Title className='XXL'>My Collections</Title>
                  <PrivateRoute>
                    <Collections />
                  </PrivateRoute>
                </>
              }
            />

            <Route
              path={routes.myAssets.collectionEdit()}
              element={
                <>
                  <Title className='XXL'>Edit Collection Metadata</Title>
                  <PrivateRoute redirectTo={routes.myAssets.collections}>
                    <CollectionEdit />
                  </PrivateRoute>
                </>
              }
            />

            <Route path={routes.myAssets.nfts()} element={<Outlet />}>
              <Route
                index
                element={
                  <>
                    <Title className='XXL'>NFTs</Title>
                    <PrivateRoute redirectTo={routes.myAssets.collections}>
                      <MyNfts />
                    </PrivateRoute>
                  </>
                }
              />

              <Route
                path={routes.myAssets.nftEdit()}
                element={
                  <>
                    <Title className='XXL'>Edit NFT metadata</Title>
                    <PrivateRoute redirectTo={routes.myAssets.collections}>
                      <NftEdit />
                    </PrivateRoute>
                  </>
                }
              />
            </Route>
          </Route>

          <Route path={routes.myAssets.pools} element={<Outlet />}>
            <Route
              index
              element={
                <>
                  <Title className='XXL'>My Pools</Title>
                  <PrivateRoute>
                    <MyPools />
                  </PrivateRoute>
                </>
              }
            />

            <Route
              path={routes.myAssets.createPool}
              element={
                <>
                  <Title className='XXL'>Create Liquidity Pool</Title>
                  <PrivateRoute redirectTo={routes.discover.pools}>
                    <CreatePool />
                  </PrivateRoute>
                </>
              }
            />
          </Route>
        </Route>

        <Route path={routes.discover.index} element={<Discover />}>
          <Route path={routes.discover.nfts} element={<Nfts />} />
          <Route path={routes.discover.drops} element={<Drops />} />
          <Route
            path={routes.discover.tokens}
            element={
              <>
                <Title className='XXL'>All Tokens</Title>
                <Tokens />
              </>
            }
          />
          <Route path={routes.discover.pools} element={<Outlet />}>
            <Route index element={<Pools />} />
            <Route path={routes.discover.addLiquidity()} element={<ValidateAddLiquidity />} />
          </Route>

          <Route path={routes.discover.index} element={<Navigate to={routes.discover.nfts} replace />} />
        </Route>

        <Route path={routes.swap.index} element={<Outlet />}>
          <Route index element={<Swap />} />
        </Route>

        <Route path='*' element={<Navigate to={routes.homepage} replace />} />
      </Routes>
    </SMainContainer>
  </>
);

export default App;
