import { memo } from 'react';
import styled from 'styled-components';

import Logo from '../../assets/logo.svg';
import Connect from './Connect';
import { routes } from '../../constants';

const SHat = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Hat = () => (
    <SHat>
      <a href={routes.homepage}>
        <Logo />
      </a>
      <Connect />
    </SHat>
);

export default memo(Hat);
