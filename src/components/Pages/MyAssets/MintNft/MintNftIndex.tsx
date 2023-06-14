import { memo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from 'styled-components';

import Title from '@common/Title.tsx';

import MintNftSteps from './MintNftSteps.tsx';

const SSeparator = styled.div`
  height: 1px;
  margin: 40px 0;
  background: ${({ theme }) => theme.appliedSeparator};
`;

const MintNftIndex = () => (
  <>
    <Title className='XXL'>Create NFT</Title>
    <MintNftSteps />
    <SSeparator />
    <Outlet />
  </>
);

export default memo(MintNftIndex);
