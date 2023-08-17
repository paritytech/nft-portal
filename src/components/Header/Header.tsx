import { memo } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

import ActionButton from '@buttons/ActionButton.tsx';

import SelectChain from '@header/SelectChain.tsx';

import { mediaQueries } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import Connect from './Connect.tsx';
import LogoButton from './LogoButton.tsx';

const SHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border: 1px solid ${({ theme }) => theme.appliedStroke};
  border-radius: 48px;
  margin: 0 16px 16px;
  padding: 8px;
`;

const SConnectionBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SLink = styled(Link)`
  display: none;

  @media ${mediaQueries.laptop} {
    display: block;
  }
`;

const Header = () => (
  <SHeader>
    <LogoButton />
    <SConnectionBlock>
      <SLink to={routes.myAssets.mintNftMain}>
        <ActionButton className='secondary'>Create NFT</ActionButton>
      </SLink>
      <SelectChain />
      <Connect />
    </SConnectionBlock>
  </SHeader>
);

export default memo(Header);
