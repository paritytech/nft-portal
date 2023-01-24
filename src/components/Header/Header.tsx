import { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '@assets/logo.svg';

import SelectChain from '@header/SelectChain';

import { routes } from '@helpers/routes';

import Connect from './Connect';

const SHat = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SConnectionBlock = styled.div`
  display: flex;
  gap: 10px;
`;

const Header = () => (
  <SHat>
    <Link to={routes.homepage}>
      <Logo />
    </Link>
    <SConnectionBlock>
      <Connect />
      <SelectChain />
    </SConnectionBlock>
  </SHat>
);

export default memo(Header);
