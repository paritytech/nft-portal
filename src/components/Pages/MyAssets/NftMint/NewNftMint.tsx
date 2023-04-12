import { memo } from 'react';
import { Outlet } from 'react-router-dom';

import Title from '@common/Title';

// TODO rename this file and associated route once migration to new flow is completed
const NftMint = () => {
  return (
    <>
      <Title className='XXL'>Mint NFT</Title>
      <Outlet />
    </>
  );
};

export default memo(NftMint);
