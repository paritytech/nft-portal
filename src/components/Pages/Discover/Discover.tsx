import { memo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { CssFontBoldXXL } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

const SContentNavigation = styled.div`
  ${CssFontBoldXXL}
  display: flex;
  gap: 40px;
  justify-content: center;
  margin-bottom: 40px;
`;

const SNavigationButton = styled(NavLink)`
  color: ${({ theme }) => theme.textAndIconsTertiary};
  text-decoration: none;

  &.active,
  :hover {
    color: ${({ theme }) => theme.textAndIconsPrimary};
  }
`;

const Discover = () => (
  <>
    <SContentNavigation>
      <SNavigationButton to={routes.discover.nfts}>NFTs</SNavigationButton>
      <SNavigationButton to={routes.discover.drops}>Drops</SNavigationButton>
      <SNavigationButton to={routes.discover.tokens}>Tokens</SNavigationButton>
      <SNavigationButton to={routes.discover.pools}>Pools</SNavigationButton>
    </SContentNavigation>
    <Outlet />
  </>
);

export default memo(Discover);
