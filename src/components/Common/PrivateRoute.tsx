import { memo } from 'react';
import { Navigate } from 'react-router-dom';

import { useAccounts } from '@contexts/AccountsContext';

import { SConnectButton } from '@helpers/reusableStyles';

import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount';

interface PrivateRouteProps {
  children: JSX.Element;
  redirectTo?: string;
}

const PrivateRoute = ({ children, redirectTo }: PrivateRouteProps) => {
  const { activeAccount, isAutoConnectDone } = useConnectToStoredAccount();
  const { theme } = useAccounts();

  if (isAutoConnectDone === false) {
    return null;
  }

  if (activeAccount === null && redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  if (activeAccount === null) {
    const connect = document.getElementById('connect');

    return (
      <SConnectButton onClick={() => connect?.click()} activeTheme={theme}>
        Connect Wallet
      </SConnectButton>
    );
  }

  return children;
};

export default memo(PrivateRoute);
