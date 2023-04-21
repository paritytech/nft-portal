import { memo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Title from '@common/Title';

import { CLEAN_BACKGROUND_CLASSNAME } from '@helpers/reusableStyles';

import MintNftSteps from './MintNftSteps';

const SSeparator = styled.div`
  height: 1px;
  margin: 40px 0;
  background: ${({ theme }) => theme.appliedSeparator};
`;

const MintNftIndex = () => {
  useEffect(() => {
    document.body.classList.add(CLEAN_BACKGROUND_CLASSNAME);

    return () => document.body.classList.remove(CLEAN_BACKGROUND_CLASSNAME);
  }, []);

  return (
    <>
      <Title className='XXL'>Mint NFT</Title>
      <MintNftSteps />
      <SSeparator />
      <Outlet />
    </>
  );
};

export default memo(MintNftIndex);
