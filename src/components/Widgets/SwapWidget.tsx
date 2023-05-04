import { memo, useEffect, useState } from 'react';

import { MultiAssetId } from '@helpers/interfaces';
import { getPoolId } from '@helpers/utilities';

import { useAssets } from '@hooks/useAssets';

import LoadSwapData from '@pages/Swap/LoadSwapData';

const SwapWidget = () => {
  const { getDefaultPool } = useAssets();
  const [poolId, setPoolId] = useState<[MultiAssetId, MultiAssetId]>();
  const [asset1, setAsset1] = useState<MultiAssetId>();
  const [asset2, setAsset2] = useState<MultiAssetId>();

  useEffect(() => {
    const loadDefaultData = async () => {
      const defaultPool = await getDefaultPool();

      if (defaultPool !== null) {
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

  return <LoadSwapData asset1={asset1} asset2={asset2} pool={poolId} />;
};

export default memo(SwapWidget);
