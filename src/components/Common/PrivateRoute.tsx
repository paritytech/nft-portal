import { memo } from 'react';
import { Navigate } from 'react-router-dom';

import { routes } from '@helpers/routes';
import { useAccounts } from '@contexts/AccountContext';

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
