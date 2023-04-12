import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { ThemeStyle } from '@helpers/interfaces';
import { CssFontBoldL, CssFontSemiBoldS } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

import Logo from '@images/logo.svg';

const SNav = styled.nav`
  display: flex;
  gap: 10px;
`;

const SLogoButton = styled(NavLink)`
  display: flex;
  align-items: center;
  margin-right: 32px;
  color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.textAndIconsPrimary};
  text-decoration: none;

  :hover {
    color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.textAndIconsPrimary};
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
  color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.textAndIconsTertiary};
  border-radius: 32px;

  &.active,
  :hover {
    color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.textAndIconsPrimary};
  }

  &.active {
    background-color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.fill6};
  }
`;

const Navigation = () => {
  const { theme } = useAccounts();

  return (
    <SNav>
      <SLogoButton to={routes.homepage} activetheme={theme}>
        <Logo />
        <span>Assets Portal</span>
      </SLogoButton>
      <SNavigationButton to={routes.myAssets.index} activetheme={theme}>
        My Assets
      </SNavigationButton>
      <SNavigationButton to={routes.discover.nfts} activetheme={theme}>
        Discover
      </SNavigationButton>
      <SNavigationButton to={routes.swap.index} activetheme={theme}>
        Swap
      </SNavigationButton>
    </SNav>
  );
};

export default memo(Navigation);
