import { memo, useEffect } from 'react';
import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';

import BasicButton from '@buttons/BasicButton';

import { SContentBlockContainer } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';

import { useAssets } from '@hooks/useAssets';
import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount';

import PoolsView from './PoolsView';

const Pools = () => {
  const { activeAccount } = useConnectToStoredAccount();
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
          <Link to={routes.myAssets.poolCreate}>
            <BasicButton>Create Pool</BasicButton>
          </Link>
        </Stack>
      )}
    </>
  );
};

export default memo(Pools);
