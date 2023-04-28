import { BN, BN_ZERO } from '@polkadot/util';
import { memo, useEffect, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

import type { MultiAssetId, PoolId, PoolReserves, TokenMetadata } from '@helpers/interfaces';

import { useAssets } from '@hooks/useAssets';

import Swap from '@pages/Swap/Swap';

interface LoadSwapDataProps {
  asset1: MultiAssetId;
  asset2: MultiAssetId;
  pool: PoolId;
}

const LoadSwapData = ({ asset1, asset2, pool }: LoadSwapDataProps) => {
  const { activeAccount, api } = useAccounts();
  const { getAssetBalance, getAssetMetadata, getAssetMinBalance, getPoolReserves } = useAssets();
  const [asset1Balance, setAsset1Balance] = useState<BN>();
  const [asset2Balance, setAsset2Balance] = useState<BN>();
  const [asset1Metadata, setAsset1Metadata] = useState<TokenMetadata>();
  const [asset2Metadata, setAsset2Metadata] = useState<TokenMetadata>();
  const [asset1MinKeep, setAsset1MinKeep] = useState<BN>();
  const [asset2MinKeep, setAsset2MinKeep] = useState<BN>();
  const [poolReserves, setPoolReserves] = useState<PoolReserves>();

  useEffect(() => {
    if (api) {
      getAssetMetadata(asset1).then(setAsset1Metadata);
      getAssetMetadata(asset2).then(setAsset2Metadata);
      getAssetMinBalance(asset1).then((value) => setAsset1MinKeep(value || BN_ZERO));
      getAssetMinBalance(asset2).then((value) => setAsset2MinKeep(value || BN_ZERO));
      getPoolReserves(pool[0], pool[1]).then(setPoolReserves);
    }
  }, [api, activeAccount, asset1, asset2, getAssetMetadata, getAssetMinBalance, getPoolReserves, pool]);

  useEffect(() => {
    if (api && activeAccount) {
      getAssetBalance(asset1).then((balance) => setAsset1Balance(balance || BN_ZERO));
      getAssetBalance(asset2).then((balance) => setAsset2Balance(balance || BN_ZERO));
    }
  }, [api, activeAccount, asset1, asset2, getAssetBalance]);

  if (!asset1Metadata || !asset2Metadata || !poolReserves || !asset1MinKeep || !asset2MinKeep) {
    return <>Loading data... please wait</>;
  }

  // TODO: subscribe to poolReserves, fetch every x seconds while the component is mounted and the page is active

  return (
    <Swap
      asset1={asset1}
      asset2={asset2}
      pool={pool}
      asset1Metadata={asset1Metadata}
      asset2Metadata={asset2Metadata}
      minKeepAmount1={asset1MinKeep}
      minKeepAmount2={asset2MinKeep}
      poolReserves={poolReserves}
      asset1Balance={asset1Balance}
      asset2Balance={asset2Balance}
      swapFee={api.consts.assetConversion.lpFee.toNumber() ?? 0}
    />
  );
};

export default memo(LoadSwapData);
