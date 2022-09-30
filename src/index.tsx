import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';

import App from './App';
import { styleSettings } from './helpers';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${styleSettings.colors.blackHaze};
  }
`;

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('app'),
);
