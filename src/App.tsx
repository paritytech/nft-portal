import '@polkadot/api-augment';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { createGlobalStyle, styled } from 'styled-components';

import PrivateRoute from '@common/PrivateRoute.tsx';
import Title from '@common/Title.tsx';

import Header from '@header/Header.tsx';

import { ALTERNATE_BACKGROUND_CLASSNAME, mediaQueries } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import Drops from '@pages/Assets/Nfts/Drops.tsx';
import Nfts from '@pages/Assets/Nfts/Nfts.tsx';
import Pools from '@pages/Assets/Pools/Pools.tsx';
import ValidateAddLiquidity from '@pages/Assets/Pools/ValidateAddLiquidity.tsx';
import Tokens from '@pages/Assets/Tokens/Tokens.tsx';
import Discover from '@pages/Discover/Discover.tsx';
import CreateCollection from '@pages/MyAssets/MintNft/CreateCollection.tsx';
import LoadCollectionsData from '@pages/MyAssets/MintNft/LoadCollectionsData.tsx';
import MintNft from '@pages/MyAssets/MintNft/MintNft.tsx';
import MintNftIndex from '@pages/MyAssets/MintNft/MintNftIndex.tsx';
import MyAssets from '@pages/MyAssets/MyAssets.tsx';
import CreatePool from '@pages/MyAssets/Pools/CreatePool.tsx';
import MyPools from '@pages/MyAssets/Pools/MyPools.tsx';
import CollectionEdit from '@pages/Nfts/Collections/CollectionEdit.tsx';
import Collections from '@pages/Nfts/Collections/Collections.tsx';
import NftEdit from '@pages/Nfts/Nfts/NftEdit.tsx';
import MyNfts from '@pages/Nfts/Nfts/Nfts.tsx';
import ValidateSwap from '@pages/Swap/ValidateSwap.tsx';

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

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 24px 0 0;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    background: ${({ theme }) => theme.backgroundSystem};
    color: ${({ theme }) => theme.textAndIconsSecondary};

    &.${ALTERNATE_BACKGROUND_CLASSNAME} {
      background: ${({ theme }) => theme.backgroundPrimary};
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
          <Route index element={<ValidateSwap />} />
          <Route path={routes.swap.assets()} element={<ValidateSwap />} />
        </Route>

        <Route path='*' element={<Navigate to={routes.homepage} replace />} />
      </Routes>
    </SMainContainer>
  </>
);

export default App;
