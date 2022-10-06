import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';

import { Hat, Home } from './components/Main';
import { routes, styleSettings } from './constants';

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

const App = () => (
  <BrowserRouter>
    <SMainContainer>
      <Hat />
      <Routes>
        <Route path={routes.homepage} element={<Home />} />
        <Route path='*' element={<Navigate to={routes.homepage} replace />} />
      </Routes>
    </SMainContainer>
  </BrowserRouter>
);

export default App;
