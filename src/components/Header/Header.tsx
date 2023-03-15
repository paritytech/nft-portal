import { memo } from 'react';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import SelectChain from '@header/SelectChain';

import { Themeable } from '@helpers/interfaces';

import Connect from './Connect';
import Navigation from './Navigation';

const SHeader = styled.header<Themeable>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ activeTheme }) => activeTheme.navigationBackground};
  border-radius: 32px;
  margin-bottom: 20px;
  padding: 8px 16px;
`;

const SConnectionBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Header = () => {
  const { theme } = useAccounts();

  return (
    <SHeader activeTheme={theme}>
      <Navigation />
      <SConnectionBlock>
        <SelectChain />
        <Connect />
      </SConnectionBlock>
    </SHeader>
  );
};

export default memo(Header);
