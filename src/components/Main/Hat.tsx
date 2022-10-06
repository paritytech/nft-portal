import { memo } from 'react';
import styled from 'styled-components';

import Logo from '../../assets/logo.svg';
import { routes } from '../../constants';

const SHat = styled.div`
  margin-bottom: 20px;
`;

const Hat = () => (
  <SHat>
    <a href={routes.homepage}>
      <Logo />
    </a>
  </SHat>
);

export default memo(Hat);
