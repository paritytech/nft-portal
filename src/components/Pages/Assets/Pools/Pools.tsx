import { memo, useEffect } from 'react';
import { Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton.tsx';

import Title from '@common/Title.tsx';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { SContentBlockContainer } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import { useAssets } from '@hooks/useAssets.ts';

import PoolsView from './PoolsView.tsx';

const Pools = () => {
  const { activeAccount } = useAccounts();
  const { getAllTokens, getPools, allTokens, pools } = useAssets();

  useEffect(() => {
    getPools();
    getAllTokens();
  }, [getPools, getAllTokens]);

  return (
    <>
      <Title className='XXL'>All Pools</Title>
      <SContentBlockContainer>
        <PoolsView pools={pools} allTokens={allTokens} />
      </SContentBlockContainer>
      {activeAccount && (
        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <Link to={routes.myAssets.createPool}>
            <ActionButton>Create Pool</ActionButton>
          </Link>
        </Stack>
      )}
    </>
  );
};

export default memo(Pools);
