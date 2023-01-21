import { memo } from 'react';
import { Navigate } from 'react-router-dom';

import { useAccounts } from '@contexts/AccountContext';

import { routes } from '@helpers/routes';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { activeAccount } = useAccounts();

  if (activeAccount === null) {
    return <Navigate to={routes.homepage} replace />;
  }

  return children;
};

export default memo(PrivateRoute);
