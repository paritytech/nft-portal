import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Title from '@common/Title';

import Steps from './Steps';

const SSeparator = styled.div`
  height: 1px;
  margin: 40px 0;
  background: ${({ theme }) => theme.appliedSeparator};
`;

const MintNftIndex = () => {
  return (
    <>
      <Title className='XXL'>Mint NFT</Title>
      <Steps />
      <SSeparator />
      <Outlet />
    </>
  );
};

export default memo(MintNftIndex);
