import { ReactElement, memo } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { Themeable } from '@helpers/interfaces';
import { CssFontRegularXL, SConnectButton } from '@helpers/reusableStyles';

import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount';

const SDoIt = styled.div<Themeable>`
  ${CssFontRegularXL}
  margin-bottom: 32px;
  color: ${({ activeTheme }) => activeTheme.textAndIconsSecondary};
`;

interface PrivateRouteProps {
  children: ReactElement;
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
      <>
        <SDoIt activeTheme={theme}>Connect wallet to see your assets</SDoIt>
        <SConnectButton onClick={() => connect?.click()} activeTheme={theme} className='call-to-action'>
          Connect Wallet
        </SConnectButton>
      </>
    );
  }

  return children;
};

export default memo(PrivateRoute);
