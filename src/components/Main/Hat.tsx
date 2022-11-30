import { memo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Logo from '../../assets/logo.svg';
import Connect from './Connect';
import { routes } from '../../constants';

const SHat = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Hat = () => (
  <SHat>
    <Link to={routes.homepage}>
      <Logo />
    </Link>
    <Connect />
  </SHat>
);

export default memo(Hat);
