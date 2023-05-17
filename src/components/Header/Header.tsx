import { memo } from 'react';
import { styled } from 'styled-components';

import SelectChain from '@header/SelectChain.tsx';

import Connect from './Connect.tsx';
import Navigation from './Navigation.tsx';

const SHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.fill6};
  border-radius: 32px;
  margin: 0 16px 16px;
  padding: 8px 16px;
`;

const SConnectionBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Header = () => (
  <SHeader>
    <Navigation />
    <SConnectionBlock>
      <SelectChain />
      <Connect />
    </SConnectionBlock>
  </SHeader>
);

export default memo(Header);
