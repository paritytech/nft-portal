import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Hat, Home } from './components/Main';
import { routes } from './constants';

const App = () => (
  <BrowserRouter>
    <Hat />
    <Routes>
      <Route path={routes.homepage} element={<Home />} />
      <Route path='*' element={<Navigate to={routes.homepage} replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
