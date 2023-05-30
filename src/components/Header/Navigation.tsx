import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';

import { CssFontBoldL, CssFontSemiBoldS } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import Logo from '@images/logo.svg';

const SNav = styled.nav`
  display: flex;
  gap: 10px;
`;

const SLogoButton = styled(NavLink)`
  display: flex;
  align-items: center;
  margin-right: 32px;
  color: ${({ theme }) => theme.textAndIconsPrimary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.textAndIconsPrimary};
  }

  svg {
    width: 40px;
    height: 40px;
  }

  span {
    ${CssFontBoldL}
    padding-left: 12px;
  }
`;

const SNavigationButton = styled(NavLink)`
  ${CssFontSemiBoldS}
  height: 48px;
  line-height: 48px;
  padding: 0 16px;
  text-decoration: none;
  text-align: center;
  color: ${({ theme }) => theme.textAndIconsTertiary};
  border-radius: 32px;

  &.active,
  &:hover {
    color: ${({ theme }) => theme.textAndIconsPrimary};
  }

  &.active {
    background-color: ${({ theme }) => theme.fill6};
  }
`;

const Navigation = () => (
  <SNav>
    <SLogoButton to={routes.homepage}>
      <Logo />
      <span>Assets Portal</span>
    </SLogoButton>
    <SNavigationButton to={routes.myAssets.index}>My Assets</SNavigationButton>
    <SNavigationButton to={routes.discover.index}>Discover</SNavigationButton>
    <SNavigationButton to={routes.swap.index}>Swap</SNavigationButton>
  </SNav>
);

export default memo(Navigation);
