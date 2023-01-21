import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';

import { styleSettings } from '@helpers/config';

import App from './App';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${styleSettings.colors.blackHaze};
  }
`;

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);

root.render(
  <>
    <GlobalStyle />
    <App />
  </>,
);
