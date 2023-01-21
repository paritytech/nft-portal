import { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '@assets/logo.svg';

import { routes } from '@helpers/routes';

import Connect from './Connect';

const SHat = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Header = () => (
  <SHat>
    <Link to={routes.homepage}>
      <Logo />
    </Link>
    <Connect />
  </SHat>
);

export default memo(Header);
