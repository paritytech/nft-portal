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
  const {
    getAssetBalance,
    getAssetMetadata,
    getNativeBalance,
    getNativeMetadata,
    getPoolReserves,
    nativeMetadata,
    nativeBalance,
  } = useAssets();
  const [assetBalance, setAssetBalance] = useState<BN>(BN_ZERO);
  const [assetMetadata, setAssetMetadata] = useState<TokenMetadata>();
  const [poolReserves, setPoolReserves] = useState<PoolReserves>();

  useEffect(() => {
    if (api) {
      if (asset1 && asset2) {
        getAssetMetadata(asset2.asAsset).then(setAssetMetadata);
        getPoolReserves(asset1, asset2).then(setPoolReserves);
      }
      if (activeAccount && asset2) {
        getAssetBalance(asset2.asAsset).then((balance) => setAssetBalance(balance || BN_ZERO));
        getNativeBalance();
      }
    }
  }, [api, activeAccount, asset1, asset2, getAssetBalance, getAssetMetadata, getNativeBalance, getPoolReserves]);

  useEffect(() => {
    if (api && !nativeMetadata) {
      getNativeMetadata();
    }
  }, [api, getNativeMetadata, nativeMetadata]);

  if (!api) {
    return null;
  }

  if (!nativeMetadata || !assetMetadata || !poolReserves) {
    return <>Loading data... please wait</>;
  }

  return (
    <AddLiquidity
      asset1={asset1}
      asset2={asset2}
      nativeMetadata={nativeMetadata}
      assetMetadata={assetMetadata}
      minAmount1={api.consts.balances.existentialDeposit.toBn()}
      minAmount2={assetMetadata.details?.minBalance.toBn() || BN_ZERO}
      poolReserves={poolReserves}
      isNewPool={isPoolEmpty(poolReserves)}
      nativeBalance={nativeBalance}
      assetBalance={assetBalance}
    />
  );
};

export default memo(LoadAddLiquidityData);
