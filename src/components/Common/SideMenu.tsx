import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { styleSettings } from '@helpers/reusableStyles';
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
  color: ${styleSettings.colors.shark};
  background-color: ${styleSettings.colors.alto};
  border-radius: 20px;
  text-align: center;

  &.active {
    color: ${styleSettings.colors.white};
    background-color: ${styleSettings.colors.cerise};
  }

  :hover {
    color: ${styleSettings.colors.shark};
  }

  &.active:hover {
    color: ${styleSettings.colors.white};
  }
`;

const SideMenu = () => {
  const { pathname } = useLocation();

  if (normalizePath(pathname) === routes.homepage) {
    return null;
  }

  return (
    <SNav>
      <SMenuButton to={routes.collections}>My NFTs</SMenuButton>
    </SNav>
  );
};

export default memo(SideMenu);
