import { memo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '@assets/logo.svg';

import { useAccounts } from '@contexts/AccountsContext';

import SelectChain from '@header/SelectChain';

import { ThemeStyle } from '@helpers/interfaces';
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

const SLogo = styled(Logo)`
  path:first-of-type {
    fill: ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.logoTextColor};
  }
`;

function Header() {
  const { theme } = useAccounts();

  return (
    <SHat>
      <Link to={routes.homepage}>
        <SLogo activetheme={theme} />
      </Link>
      <SConnectionBlock>
        <Connect />
        <SelectChain />
      </SConnectionBlock>
    </SHat>
  );
}

export default memo(Header);
