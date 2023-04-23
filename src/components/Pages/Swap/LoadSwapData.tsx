import { BN, BN_ZERO } from '@polkadot/util';
import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAccounts } from '@contexts/AccountsContext';

import type { MultiAssetId, PoolReserves, TokenMetadata } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { fromMultiAsset, isPoolEmpty } from '@helpers/utilities';

import { useAssets } from '@hooks/useAssets';

import Swap from '@pages/Swap/Swap';

interface LoadSwapDataProps {
  asset1: MultiAssetId;
  asset2: MultiAssetId;
}

const LoadSwapData = ({ asset1, asset2 }: LoadSwapDataProps) => {
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

  if (isPoolEmpty(poolReserves)) {
    return (
      <>
        The pool is empty. Please all some liquidity first{' '}
        <Link to={routes.discover.addLiquidity(fromMultiAsset(asset1), fromMultiAsset(asset2))}>here</Link>
      </>
    );
  }

  // TODO: check what data we would need to display in swap details, like price impact/slippage
  // 1) how to get the rate
  // 2) how to calculate the impact
  // TODO: check other exchanges' code
  // TODO: subscribe to poolReserves, fetch every x seconds while the component is mounted

  return (
    <Swap
      asset1={asset1}
      asset2={asset2}
      nativeMetadata={nativeMetadata}
      assetMetadata={assetMetadata}
      minKeepAmount1={api.consts.balances.existentialDeposit.toBn()}
      minKeepAmount2={assetMetadata.details?.minBalance.toBn() || BN_ZERO}
      poolReserves={poolReserves}
      nativeBalance={nativeBalance}
      assetBalance={assetBalance}
    />
  );
};

export default memo(LoadSwapData);
