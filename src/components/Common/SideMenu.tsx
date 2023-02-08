import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { ThemeStyle } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { normalizePath } from '@helpers/utilities';

const SNav = styled.nav`
  display: flex;
  flex-direction: column;
  min-width: 176px;
  gap: 20px;
`;

const SMenuButton = styled(NavLink)`
  text-decoration: none;
  padding: 8px 20px;
  color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.menuButtonTextColor};
  background-color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.menuButtonBackgroundColor};
  border: 2px solid ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.menuButtonBorderColor};
  border-radius: 20px;
  text-align: center;

  &.active,
  :hover {
    color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.menuButtonActiveTextColor};
    border-color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.menuButtonActiveBorderColor};
    background-color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.menuButtonActiveBackgroundColor};
  }
`;

const SideMenu = () => {
  const { pathname } = useLocation();
  const { theme } = useAccounts();

  if (normalizePath(pathname) === routes.homepage) {
    return null;
  }

  return (
    <SNav>
      <SMenuButton to={routes.collections} activetheme={theme}>
        My NFTs
      </SMenuButton>
      <SMenuButton to={routes.dex} activetheme={theme}>
        DEX
      </SMenuButton>
    </SNav>
  );
};

export default memo(SideMenu);
