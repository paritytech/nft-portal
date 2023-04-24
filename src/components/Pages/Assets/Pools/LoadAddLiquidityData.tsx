import { BN, BN_ZERO } from '@polkadot/util';
import { memo, useEffect, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

import type { MultiAssetId, PoolReserves, TokenMetadata } from '@helpers/interfaces';
import { isPoolEmpty } from '@helpers/utilities';

import { useAssets } from '@hooks/useAssets';

import AddLiquidity from '@pages/Assets/Pools/AddLiquidity';

interface LoadAddLiquidityDataProps {
  asset1: MultiAssetId;
  asset2: MultiAssetId;
}

const LoadAddLiquidityData = ({ asset1, asset2 }: LoadAddLiquidityDataProps) => {
  const { activeAccount, api } = useAccounts();
  const { getAssetBalance, getAssetMetadata, getAssetMinBalance, getPoolReserves } = useAssets();
  const [asset1Balance, setAsset1Balance] = useState<BN>();
  const [asset2Balance, setAsset2Balance] = useState<BN>();
  const [asset1MinBalance, setAsset1MinBalance] = useState<BN>();
  const [asset2MinBalance, setAsset2MinBalance] = useState<BN>();
  const [asset1Metadata, setAsset1Metadata] = useState<TokenMetadata>();
  const [asset2Metadata, setAsset2Metadata] = useState<TokenMetadata>();
  const [poolReserves, setPoolReserves] = useState<PoolReserves>();

  useEffect(() => {
    if (api) {
      getAssetMetadata(asset1).then(setAsset1Metadata);
      getAssetMetadata(asset2).then(setAsset2Metadata);
      getAssetMinBalance(asset1).then((balance) => setAsset1MinBalance(balance || BN_ZERO));
      getAssetMinBalance(asset2).then((balance) => setAsset2MinBalance(balance || BN_ZERO));
      getPoolReserves(asset1, asset2).then(setPoolReserves);
    }
  }, [api, activeAccount, asset1, asset2, getAssetMinBalance, getAssetMetadata, getPoolReserves]);

  useEffect(() => {
    if (api && activeAccount) {
      getAssetBalance(asset1).then((balance) => setAsset1Balance(balance || BN_ZERO));
      getAssetBalance(asset2).then((balance) => setAsset2Balance(balance || BN_ZERO));
    }
  }, [api, activeAccount, asset1, asset2, getAssetBalance]);

  if (!asset1Metadata || !asset2Metadata || !poolReserves) {
    return <>Loading data... please wait</>;
  }

  return (
    <AddLiquidity
      asset1={asset1}
      asset2={asset2}
      asset1Metadata={asset1Metadata}
      asset2Metadata={asset2Metadata}
      minAmount1={asset1MinBalance}
      minAmount2={asset2MinBalance}
      poolReserves={poolReserves}
      isNewPool={isPoolEmpty(poolReserves)}
      asset1Balance={asset1Balance}
      asset2Balance={asset2Balance}
    />
  );
};

export default memo(LoadAddLiquidityData);
