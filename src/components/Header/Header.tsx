import { memo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { routes } from '@helpers/routes';
import Logo from '@assets/logo.svg';
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
