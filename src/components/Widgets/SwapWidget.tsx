import { memo, useCallback, useEffect, useState } from 'react';

import { MultiAssetId } from '@helpers/interfaces.ts';
import { getPoolId } from '@helpers/utilities.ts';

import { useAssets } from '@hooks/useAssets.ts';

import LoadSwapData from '@pages/Swap/LoadSwapData.tsx';

const SwapWidget = () => {
  const { getDefaultPool } = useAssets();
  const [poolId, setPoolId] = useState<[MultiAssetId, MultiAssetId]>();
  const [asset1, setAsset1] = useState<MultiAssetId>();
  const [asset2, setAsset2] = useState<MultiAssetId>();

  const handleTokenChange = useCallback((asset1: MultiAssetId, asset2: MultiAssetId) => {
    setAsset1(asset1);
    setAsset2(asset2);
  }, []);

  useEffect(() => {
    const loadDefaultData = async () => {
      const defaultPool = await getDefaultPool();

      if (defaultPool) {
        const poolId = getPoolId(defaultPool[0], defaultPool[1]);

        setAsset1(defaultPool[0]);
        setAsset2(defaultPool[1]);
        setPoolId(poolId);
      }
    };

    loadDefaultData();
  }, [getDefaultPool]);

  if (!poolId || !asset1 || !asset2) {
    return null;
  }

  return <LoadSwapData asset1={asset1} asset2={asset2} pool={poolId} handleTokenChange={handleTokenChange} />;
};

export default memo(SwapWidget);
