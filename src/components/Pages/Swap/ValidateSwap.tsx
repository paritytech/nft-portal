import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import NotFound from '@common/NotFound.tsx';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import type { MultiAssetId } from '@helpers/interfaces.ts';
import { routes } from '@helpers/routes.ts';
import { getPoolId, multiAssetToParam, parseAssetParam } from '@helpers/utilities.ts';

import { useAssets } from '@hooks/useAssets.ts';

import LoadSwapData from '@pages/Swap/LoadSwapData.tsx';

const ValidateSwap = () => {
  const { api } = useAccounts();
  const { getDefaultPool } = useAssets();
  const navigate = useNavigate();
  const { assetId1, assetId2 } = useParams();
  const asset1 = useRef<MultiAssetId | null>(null);
  const asset2 = useRef<MultiAssetId | null>(null);
  const [paramsValid, setParamsValid] = useState<boolean | null>(null);
  const [poolId, setPoolId] = useState<[MultiAssetId, MultiAssetId]>();

  const validateParams = useCallback(async () => {
    if (!api || !api.query.assetConversion) return;

    if (assetId1 && assetId2) {
      let paramsValid = false;
      asset1.current = parseAssetParam(assetId1, api);
      asset2.current = parseAssetParam(assetId2, api);

      if (asset1.current && asset2.current) {
        const poolId = getPoolId(asset1.current as MultiAssetId, asset2.current as MultiAssetId);
        setPoolId(poolId);
        const poolExists = !(await api.query.assetConversion.pools(poolId)).isEmpty;
        if (poolExists) paramsValid = true;
      }

      setParamsValid(paramsValid);
    } else {
      const defaultPool = await getDefaultPool();

      if (defaultPool) {
        navigate(routes.swap.assets(multiAssetToParam(defaultPool[0]), multiAssetToParam(defaultPool[1])));
      }
    }
  }, [api, assetId1, assetId2, getDefaultPool, navigate]);

  const handleTokenChange = useCallback(
    (asset1: MultiAssetId, asset2: MultiAssetId) => {
      navigate(routes.swap.assets(multiAssetToParam(asset1), multiAssetToParam(asset2)));
    },
    [navigate],
  );

  useEffect(() => {
    validateParams();
  }, [validateParams]);

  if (!api || paramsValid === null) {
    return null;
  }

  if (!paramsValid || !poolId) {
    return <NotFound />;
  }

  return (
    <LoadSwapData
      asset1={asset1.current as MultiAssetId}
      asset2={asset2.current as MultiAssetId}
      pool={poolId}
      handleTokenChange={handleTokenChange}
    />
  );
};

export default memo(ValidateSwap);
