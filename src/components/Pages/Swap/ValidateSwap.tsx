import { memo, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import NotFound from '@common/NotFound';

import { useAccounts } from '@contexts/AccountsContext';

import type { MultiAssetId } from '@helpers/interfaces';
import { constructMultiAsset } from '@helpers/utilities';

import { useAssets } from '@hooks/useAssets';

import LoadSwapData from '@pages/Swap/LoadSwapData';

const ValidateSwap = () => {
  const [paramsValid, setParamsValid] = useState<boolean | null>(null);
  const [poolId, setPoolId] = useState<[MultiAssetId, MultiAssetId]>(null);
  const { assetId1, assetId2 } = useParams();
  const { api } = useAccounts();
  const { getDefaultPool } = useAssets();

  const validateParams = useCallback(async () => {
    if (!api) return;
    if (assetId1 && assetId2) {
      let paramsValid = false;
      const token1 = constructMultiAsset(assetId1, api);
      const token2 = constructMultiAsset(assetId2, api);
      if (token1 && token2) {
        const poolId = [token1, token2];
        setPoolId(poolId);
        const poolExists = !(await api.query.assetConversion.pools(poolId)).isEmpty;
        if (poolExists) paramsValid = true;
      }
      setParamsValid(paramsValid);
    } else {
      const defaultPool = await getDefaultPool();
      if (defaultPool !== null) {
        const token1 = constructMultiAsset('native', api);
        const token2 = constructMultiAsset(defaultPool.toString(), api);
        if (token1 && token2) {
          const poolId = [token1, token2];
          setPoolId(poolId);
        }
      }
      setParamsValid(defaultPool !== null);
    }
  }, [api, assetId1, assetId2, getDefaultPool]);

  useEffect(() => {
    validateParams();
  }, [validateParams]);

  if (!api || paramsValid === null) {
    return null;
  }

  if (!paramsValid || !poolId) {
    return <NotFound />;
  }

  return <LoadSwapData asset1={poolId[0]} asset2={poolId[1]} />;
};

export default memo(ValidateSwap);
