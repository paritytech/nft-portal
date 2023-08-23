import SetupWallets from 'SetupWallets.tsx';
import { BrowserRouter } from 'react-router-dom';

import { AccountsContextProvider } from '@contexts/AccountsContext.tsx';
import { ModalStatusContextProvider } from '@contexts/ModalStatusContext.tsx';

const SetupApp = () => (
  <BrowserRouter>
    <ModalStatusContextProvider>
      <AccountsContextProvider>
        <SetupWallets />
      </AccountsContextProvider>
    </ModalStatusContextProvider>
  </BrowserRouter>
);

export default SetupApp;
