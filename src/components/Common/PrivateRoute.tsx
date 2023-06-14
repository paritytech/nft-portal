import { ReactElement, memo } from 'react';
import { Navigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { CssFontRegularXL, SConnectButton } from '@helpers/reusableStyles.ts';

import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount.ts';

const SDoIt = styled.div`
  ${CssFontRegularXL}
  margin-bottom: 32px;
  color: ${({ theme }) => theme.textAndIconsSecondary};
`;

interface PrivateRouteProps {
  children: ReactElement;
  redirectTo?: string;
}

const PrivateRoute = ({ children, redirectTo }: PrivateRouteProps) => {
  const { activeAccount, isAutoConnectDone } = useConnectToStoredAccount();

  if (isAutoConnectDone === false) {
    return null;
  }

  if (activeAccount === null && redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  if (activeAccount === null) {
    const connect = document.getElementById('connect');

    return (
      <>
        <SDoIt>Connect wallet to see your assets</SDoIt>
        <SConnectButton onClick={() => connect?.click()}>Connect Wallet</SConnectButton>
      </>
    );
  }

  return children;
};

export default memo(PrivateRoute);
