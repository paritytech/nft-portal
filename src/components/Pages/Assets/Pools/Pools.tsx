import { memo, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton';

import Title from '@common/Title';

import { useAccounts } from '@contexts/AccountsContext';

import { SContentBlockContainer } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

import { useAssets } from '@hooks/useAssets';

import PoolsView from './PoolsView';

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
