import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';

import App from './App';
import { styleSettings } from './helpers';

const GlobalStyle = createGlobalStyle`
  body {
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
