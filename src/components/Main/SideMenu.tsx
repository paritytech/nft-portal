import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { routes, styleSettings } from '../../constants';

const SNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SMenuButton = styled.div<SMenuButtonProps>`
  padding: 8px 20px;
  background-color: ${({ route, currentRoute }) => (route === currentRoute ? styleSettings.colors.cerise : styleSettings.colors.alto)};
  border-radius: 20px;
  text-align: center;

  a {
    color: ${styleSettings.colors.shark};
    text-decoration: none;
  }
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
      <SMenuButton route={routes.nftCollections} currentRoute={pathname}>
        <Link to={routes.nftCollections}>My Nft Collection</Link>
      </SMenuButton>
      <SMenuButton route={routes.newCollection} currentRoute={pathname}>
        <Link to={routes.newCollection}>New Collection</Link>
      </SMenuButton>
      <SMenuButton route={routes.mintNft} currentRoute={pathname}>
        <Link to={routes.mintNft}>Mint NFT</Link>
      </SMenuButton>
    </SNav>
  );
};

export default memo(SideMenu);
