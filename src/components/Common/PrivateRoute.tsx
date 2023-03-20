import { memo } from 'react';
import { Navigate } from 'react-router-dom';

import { routes } from '@helpers/routes';

import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { activeAccount, isAutoConnectDone } = useConnectToStoredAccount();

  if (isAutoConnectDone === false) {
    return null;
  }

  if (activeAccount === null) {
    return <Navigate to={routes.homepage} replace />;
  }

  return children;
};

export default memo(PrivateRoute);
