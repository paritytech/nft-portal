import { memo, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton';

import { useAccounts } from '@contexts/AccountsContext';

import { SContentBlockContainer } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

import { useAssets } from '@hooks/useAssets';

import PoolsView from './PoolsView';

const Pools = () => {
  const { activeAccount } = useAccounts();
  const { getNativeMetadata, getPools, getTokensMetadata, nativeMetadata, pools, tokensMetadata } = useAssets();
  useEffect(() => {
    getPools();
    getNativeMetadata();
    getTokensMetadata();
  }, [getPools, getNativeMetadata, getTokensMetadata]);

  return (
    <>
      <h2>All Pools</h2>
      <SContentBlockContainer>
        <PoolsView pools={pools} nativeMetadata={nativeMetadata} tokensMetadata={tokensMetadata} />
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
