import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';

import { CssFontBoldL, mediaQueries } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import Logo from '@images/logo.svg';
import MiniLogo from '@images/mini-logo.svg';

const SLogoButton = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 8px 24px 8px 8px;
  color: ${({ theme }) => theme.textAndIconsPrimary};
  text-decoration: none;
  border-radius: 40px;

  &:hover {
    color: ${({ theme }) => theme.textAndIconsPrimary};
    background-color: ${({ theme }) => theme.appliedHover};
  }

  .logo {
    display: none;

    @media ${mediaQueries.laptop} {
      display: block;
    }
  }

  .mini-logo {
    width: 34px;
    height: 32px;
    margin-right: 8px;

    @media ${mediaQueries.laptop} {
      display: none;
    }
  }
`;

const SDappName = styled.div`
  ${CssFontBoldL}

  span {
    display: none;
  }

  @media ${mediaQueries.tablet} {
    span {
      display: inline;
    }
  }
`;

const SMeridian = styled.div`
  display: none;
  width: 1px;
  height: 24px;
  background-color: ${({ theme }) => theme.appliedSeparator};
  margin: 0 16px;

  @media ${mediaQueries.laptop} {
    display: block;
  }
`;

const LogoButton = () => (
  <SLogoButton to={routes.homepage}>
    <Logo className='logo' />
    <MiniLogo className='mini-logo' />
    <SMeridian></SMeridian>
    <SDappName>
      NFT <span>Portal</span>
    </SDappName>
  </SLogoButton>
);

export default memo(LogoButton);
