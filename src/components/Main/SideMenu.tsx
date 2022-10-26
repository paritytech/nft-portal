import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { routes, styleSettings } from '../../constants';

const SNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 20px;

  a {
    color: ${styleSettings.colors.shark};
  }
`;

const SMenuButton = styled(Link)<SMenuButtonProps>`
  color: ${styleSettings.colors.shark};
  text-decoration: none;
  padding: 8px 20px;
  background-color: ${({ route, currentRoute }) => (route === currentRoute ? styleSettings.colors.cerise : styleSettings.colors.alto)};
  border-radius: 20px;
  text-align: center;
`;

interface SMenuButtonProps {
  route: string;
  currentRoute: string;
}

const SideMenu = () => {
  const { pathname } = useLocation();

  if (pathname === routes.homepage) {
    return null;
  }

  return (
    <SNav>
      <SMenuButton to={routes.nftCollections} route={routes.nftCollections} currentRoute={pathname}>
        My Nft Collection
      </SMenuButton>
      <SMenuButton to={routes.newCollection} route={routes.newCollection} currentRoute={pathname}>
        New Collection
      </SMenuButton>
      <SMenuButton to={routes.mintNft} route={routes.mintNft} currentRoute={pathname}>
        Mint NFT
      </SMenuButton>
    </SNav>
  );
};

export default memo(SideMenu);
