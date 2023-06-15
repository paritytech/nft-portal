import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from 'styled-components';

import Title from '@common/Title.tsx';

import MintNftSteps from './MintNftSteps.tsx';

const SOutlet = styled.div`
  margin-top: 52px;
`;

const MintNftIndex = () => (
  <>
    <Title className='XXL'>Create NFT</Title>
    <MintNftSteps />
    <SOutlet>
      <Outlet />
    </SOutlet>
  </>
);

export default memo(MintNftIndex);
