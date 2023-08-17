import { memo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from 'styled-components';

import Title from '@common/Title.tsx';

import { mediaQueries } from '@helpers/reusableStyles.ts';
import { alternateBackground } from '@helpers/utilities.ts';

import MintNftSteps from './MintNftSteps.tsx';

const SOutlet = styled.div`
  margin-top: 40px;

  @media ${mediaQueries.tablet} {
    margin-top: 52px;
  }
`;

const MintNftIndex = () => {
  useEffect(() => {
    return alternateBackground();
  }, []);

  return (
    <>
      <Title className='main'>Create NFT</Title>
      <MintNftSteps />
      <SOutlet>
        <Outlet />
      </SOutlet>
    </>
  );
};

export default memo(MintNftIndex);
