// import { memo, useCallback, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// import NotFound from '@common/NotFound.tsx';

// import { useAccounts } from '@contexts/AccountsContext.tsx';

// import type { PoolId } from '@helpers/interfaces.ts';
// import { parseAssetParam } from '@helpers/utilities.ts';

// import LoadAddLiquidityData from '@pages/Archived/Pools/LoadAddLiquidityData.tsx';

// const ValidateAddLiquidity = () => {
//   const [paramsValid, setParamsValid] = useState<boolean | null>(null);
//   const [poolId, setPoolId] = useState<PoolId>();
//   const { assetId1, assetId2 } = useParams();
//   const { api } = useAccounts();

//   const validateParams = useCallback(async () => {
//     if (api && api.query.assetConversion) {
//       let paramsValid = false;
//       const token1 = parseAssetParam(assetId1, api);
//       const token2 = parseAssetParam(assetId2, api);

//       if (token1 && token2) {
//         const poolId: PoolId = [token1, token2];
//         setPoolId(poolId);

//         const poolExists = !(await api.query.assetConversion.pools(poolId)).isEmpty;
//         if (poolExists) paramsValid = true;
//       }

//       setParamsValid(paramsValid);
//     }
//   }, [api, assetId1, assetId2]);

//   useEffect(() => {
//     validateParams();
//   }, [validateParams]);

//   if (!api || paramsValid === null) {
//     return null;
//   }

//   if (!paramsValid || !poolId) {
//     return <NotFound />;
//   }

//   return <LoadAddLiquidityData asset1={poolId[0]} asset2={poolId[1]} />;
// };

// export default memo(ValidateAddLiquidity);
