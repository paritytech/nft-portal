import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';

import { CssFontBoldL } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import Logo from '@images/logo.svg';

const SLogoButton = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textAndIconsPrimary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.textAndIconsPrimary};
  }

  span {
    ${CssFontBoldL}
  }
`;

const SMeridian = styled.div`
  width: 1px;
  height: 24px;
  background-color: ${({ theme }) => theme.appliedSeparator};
  margin: 0 16px;
`;

const LogoButton = () => (
  <SLogoButton to={routes.homepage}>
    <Logo />
    <SMeridian></SMeridian>
    <span>NFT</span>
  </SLogoButton>
);

export default memo(LogoButton);
