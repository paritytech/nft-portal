import { memo, useEffect } from 'react';

import { SContentBlockContainer } from '@helpers/reusableStyles';

import { useAssets } from '@hooks/useAssets';

import PoolsView from './PoolsView';

const Pools = () => {
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
    </>
  );
};

export default memo(Pools);
