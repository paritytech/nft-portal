import { memo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { ThemeStyle, Themeable } from '@helpers/interfaces';
import { CssFontBoldXXL } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

const SContentNavigation = styled.div<Themeable>`
  ${CssFontBoldXXL}
  display: flex;
  gap: 40px;
  justify-content: center;
  margin-bottom: 40px;
`;

const SNavigationButton = styled(NavLink)`
  color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.textAndIconsTertiary};
  text-decoration: none;

  &.active,
  :hover {
    color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.textAndIconsPrimary};
  }
`;

const Discover = () => {
  const { theme } = useAccounts();

  return (
    <>
      <SContentNavigation activeTheme={theme}>
        <SNavigationButton to={routes.discover.nfts} activetheme={theme}>
          NFTs
        </SNavigationButton>
        <SNavigationButton to={routes.discover.drops} activetheme={theme}>
          Drops
        </SNavigationButton>
        <SNavigationButton to={routes.discover.tokens} activetheme={theme}>
          Tokens
        </SNavigationButton>
        <SNavigationButton to={routes.discover.pools} activetheme={theme}>
          Pools
        </SNavigationButton>
      </SContentNavigation>
      <Outlet />
    </>
  );
};

export default memo(Discover);
