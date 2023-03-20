import '@polkadot/api-augment';
import { Navigate, Route, Routes } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import PrivateRoute from '@common/PrivateRoute';

import { useAccounts } from '@contexts/AccountsContext';

import Header from '@header/Header';

import { Themeable } from '@helpers/interfaces';
import { styleSettings } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

import CollectionEdit from '@pages/Assets/Collections/CollectionEdit';
import Collections from '@pages/Assets/Collections/Collections';
import Pools from '@pages/Assets/Pools/Pools';
import NewCollection from '@pages/Assets/Collections/NewCollection';
import NewNft from '@pages/Assets/Nfts/NewNft';
import NftEdit from '@pages/Assets/Nfts/NftEdit';
import Nfts from '@pages/Assets/Nfts/Nfts';
import Tokens from '@pages/Assets/Tokens/Tokens';
import Home from '@pages/Home/Home';

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
              <Route path={routes.homepage} element={<Home />} />
              <Route path={routes.collections} element={<Collections />} />
              <Route
                path={routes.collectionMint}
                element={
                  <PrivateRoute>
                    <NewCollection />
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
                    <Nfts />
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
              <Route path={routes.tokens} element={<Tokens />} />
              <Route path={routes.pools} element={<Pools />} />
              <Route path='*' element={<Navigate to={routes.homepage} replace />} />
            </Routes>
          </SContent>
        </SContainer>
      </SMainContainer>
    </>
  );
};

export default App;
