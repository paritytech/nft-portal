import type { ApiPromise } from '@polkadot/api';
import type { Option, StorageKey } from '@polkadot/types';
import type { AssetId } from '@polkadot/types/interfaces';
import type {
  PalletAssetsAssetAccount,
  PalletAssetsAssetDetails,
  PalletBalancesAccountData,
} from '@polkadot/types/lookup';
import { PalletAssetsAssetMetadata } from '@polkadot/types/lookup';
import { BN, BN_ZERO } from '@polkadot/util';
import { isEmpty } from 'lodash';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAccounts } from '@contexts/AccountsContext.tsx';
import { useModalStatus } from '@contexts/ModalStatusContext.tsx';

import { ModalStatusTypes, MultiAssets, StatusMessages, SwapTypes } from '@helpers/constants.ts';
import { handleError } from '@helpers/handleError.ts';
import type {
  Chain,
  MultiAssetId,
  PalletAssetConversionPoolId,
  PalletAssetConversionPoolInfo,
  PoolId,
  PoolInfo,
  PoolReserves,
  TokenMetadata,
  TokensDetailsMap,
  TokensDetailsRecords,
  TokensMetadataRecords,
} from '@helpers/interfaces.ts';
import { TokenWithSupply } from '@helpers/interfaces.ts';
import { routes } from '@helpers/routes.ts';
import { multiAssetToParam, sortStrings, toMultiAsset } from '@helpers/utilities.ts';

export const useAssets = () => {
  const navigate = useNavigate();
  const { api, activeAccount, storedChain, activeWallet } = useAccounts();
  const { openModalStatus, setStatus, setAction } = useModalStatus();
  const [availablePoolTokens, setAvailablePoolTokens] = useState<TokenMetadata[]>();
  const [nativeBalance, setNativeBalance] = useState<BN>();
  const [nativeMetadata, setNativeMetadata] = useState<TokenMetadata>();
  const [allTokens, setAllTokens] = useState<TokenMetadata[]>();
  const [pools, setPools] = useState<PoolInfo[]>();
  const [poolTokenPairs, setPoolTokenPairs] = useState<TokenMetadata[][]>();

  const addLiquidity = useCallback(
    async (asset1: MultiAssetId, asset2: MultiAssetId, amount1: BN, amount2: BN, amount1Min: BN, amount2Min: BN) => {
      if (api && activeAccount && activeWallet) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          const unsub = await api.tx.assetConversion
            .addLiquidity(asset1, asset2, amount1, amount2, amount1Min, amount2Min, activeAccount.address)
            .signAndSend(activeAccount.address, { signer: activeWallet.signer }, ({ events, status }) => {
              if (status.isReady) {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.POOL_ADDING_LIQUIDITY });
              }

              if (status.isInBlock) {
                unsub();

                events.some(({ event: { data, method } }) => {
                  if (method === 'LiquidityAdded') {
                    // TODO check later if we can add a proper type for data
                    // @ts-ignore
                    const poolId = data.poolId as PalletAssetConversionPoolId;

                    if (poolId && poolId[0].eq(asset1) && poolId[1].eq(asset2)) {
                      setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.POOL_LIQUIDITY_ADDED });
                      setAction(
                        () => () => navigate(routes.homepage), // TODO add proper route, routes.swap.assets(multiAssetToParam(asset1), multiAssetToParam(asset2))
                      );
                      return true;
                    }
                  }

                  if (method === 'ExtrinsicFailed') {
                    setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.ACTION_FAILED });
                    return true;
                  }

                  return false;
                });
              }
            });
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [api, activeAccount, activeWallet, navigate, openModalStatus, setStatus, setAction],
  );

  const createPool = useCallback(
    async (token1: MultiAssetId, token2: MultiAssetId) => {
      if (api && activeAccount && activeWallet) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          const unsub = await api.tx.assetConversion
            .createPool(token1, token2)
            .signAndSend(activeAccount.address, { signer: activeWallet.signer }, ({ events, status }) => {
              if (status.isReady) {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.POOL_CREATION });
              }

              if (status.isInBlock) {
                unsub();

                events.some(({ event: { data, method } }) => {
                  if (method === 'PoolCreated') {
                    // TODO check later if we can add a proper type for data
                    // @ts-ignore
                    const createdPoolId = data.poolId as PalletAssetConversionPoolId;

                    if (createdPoolId && createdPoolId[0].eq(token1) && createdPoolId[1].eq(token2)) {
                      setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.POOL_CREATED });
                      setAction(
                        () => () => navigate(routes.homepage), // TODO add proper route, routes.discover.addLiquidity(multiAssetToParam(token1), multiAssetToParam(token2))
                      );
                      return true;
                    }
                  }

                  if (method === 'ExtrinsicFailed') {
                    setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.ACTION_FAILED });
                    return true;
                  }

                  return false;
                });
              }
            });
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [api, activeAccount, activeWallet, navigate, openModalStatus, setStatus, setAction],
  );

  const swap = useCallback(
    async (
      asset1: MultiAssetId,
      asset2: MultiAssetId,
      amount1: BN,
      amount2: BN,
      amountWithSlippage: BN,
      swapType: SwapTypes,
    ) => {
      if (api && activeAccount && activeWallet) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        const swapMethod =
          swapType === SwapTypes.EXACT_SEND
            ? api.tx.assetConversion.swapExactTokensForTokens(
                [asset1, asset2],
                amount1,
                amountWithSlippage,
                activeAccount.address,
                true,
              )
            : api.tx.assetConversion.swapTokensForExactTokens(
                [asset1, asset2],
                amount2,
                amountWithSlippage,
                activeAccount.address,
                true,
              );

        try {
          const unsub = await swapMethod.signAndSend(
            activeAccount.address,
            { signer: activeWallet.signer },
            ({ events, status }) => {
              if (status.isReady) {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.SWAP_EXECUTING });
              }

              if (status.isInBlock) {
                unsub();

                events.some(({ event: { method } }) => {
                  if (method === 'SwapExecuted') {
                    setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.SWAP_EXECUTED });
                    return true;
                  }

                  if (method === 'ExtrinsicFailed') {
                    setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.ACTION_FAILED });
                    return true;
                  }

                  return false;
                });
              }
            },
          );
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [api, activeAccount, activeWallet, openModalStatus, setStatus],
  );

  const fetchAllTokensMetadata = useCallback(async (): Promise<TokenMetadata[]> => {
    let result: TokenMetadata[] = [];
    const metadata: TokensMetadataRecords = await api!.query.assets.metadata.entries();

    if (!isEmpty(metadata)) {
      result = metadata
        .map(
          ([
            {
              args: [id],
            },
            data,
          ]) => formatAssetMetadata(id, data, api!),
        )
        .sort((a, b) => sortStrings(a.symbol, b.symbol));
    }

    return result;
  }, [api]);

  const getTokenIds = useCallback(async (): Promise<AssetId[] | undefined> => {
    if (api) {
      const results: StorageKey<[AssetId]>[] = await api.query.assets.asset.keys();
      return results.map(({ args: [id] }) => id);
    }
  }, [api]);

  const getAllTokens = useCallback(async () => {
    if (allTokens || !api || !storedChain) return;

    try {
      const tokens = await fetchAllTokensMetadata();
      setAllTokens([formatNativeTokenMetadata(api, storedChain), ...tokens]);
    } catch (error) {
      //
    }
  }, [storedChain, allTokens, api, fetchAllTokensMetadata]);

  const fetchAllTokensDetails = useCallback(async (): Promise<TokensDetailsMap | undefined> => {
    const tokensIds = await getTokenIds();

    if (!api || !tokensIds) return;

    const result: TokensDetailsMap = new Map();
    const details: TokensDetailsRecords = await api.query.assets.asset.multi(tokensIds);

    if (!isEmpty(details)) {
      details.forEach((record, index) => {
        const id = tokensIds[index].toNumber();
        result.set(id, record.unwrapOr(null));
      });
    }

    return result;
  }, [api, getTokenIds]);

  const getAvailablePoolTokens = useCallback(async () => {
    if (api && api.query.assetConversion) {
      let availablePoolTokens: TokenMetadata[] = [];

      try {
        // load all tokens
        const allTokens: TokenMetadata[] = await fetchAllTokensMetadata();

        // load all pools
        const poolRecords: StorageKey<[PalletAssetConversionPoolId]>[] = await api.query.assetConversion.pools.keys();
        const pools = poolRecords.map(({ args: [id] }) => id[1].asAsset.toNumber());

        // subtract one from another
        availablePoolTokens = allTokens.filter((item) => !pools.includes(item.id.asAsset.toNumber()));
      } catch (error) {
        //
      }

      setAvailablePoolTokens(availablePoolTokens);
    }
  }, [api, fetchAllTokensMetadata]);

  const getPoolTokenPairs = useCallback(async () => {
    if (api && api.query.assetConversion && storedChain) {
      try {
        const allTokens: TokenMetadata[] = await fetchAllTokensMetadata();
        const poolRecords: StorageKey<[PalletAssetConversionPoolId]>[] = await api.query.assetConversion.pools.keys();

        const prepareAsset = (asset: MultiAssetId) => {
          if (asset.isAsset) {
            const foundToken = allTokens.find((token) => token.id.asAsset.toNumber() === asset.asAsset.toNumber());

            if (foundToken) {
              return foundToken;
            }
          } else {
            return formatNativeTokenMetadata(api, storedChain);
          }
        };

        const poolTokenPairs = poolRecords
          .map(({ args: [id] }) => [prepareAsset(id[0]), prepareAsset(id[1])])
          .filter(
            (asset): asset is TokenMetadata[] => typeof asset[0] !== 'undefined' && typeof asset[1] !== 'undefined',
          );

        setPoolTokenPairs(poolTokenPairs);
      } catch (error) {
        //
      }
    }
  }, [api, fetchAllTokensMetadata, storedChain]);

  const getAssetBalance = useCallback(
    async (assetId: MultiAssetId): Promise<BN | undefined> => {
      if (!api || !activeAccount) return;

      try {
        if (assetId.isAsset) {
          const result: Option<PalletAssetsAssetAccount> = await api.query.assets.account(
            assetId.asAsset,
            activeAccount.address,
          );
          return result.unwrapOr(null)?.balance.toBn();
        } else {
          const { data: balance } = await api.query.system.account(activeAccount.address);
          return (balance as PalletBalancesAccountData).free.toBn();
        }
      } catch (error) {
        //
      }
    },
    [api, activeAccount],
  );

  const getAssetMinBalance = useCallback(
    async (assetId: MultiAssetId): Promise<BN | undefined> => {
      if (!api) return;

      try {
        if (assetId.isAsset) {
          const result: Option<PalletAssetsAssetDetails> = await api.query.assets.asset(assetId.asAsset);
          return result.unwrapOr(null)?.minBalance.toBn();
        } else {
          return api.consts.balances.existentialDeposit.toBn();
        }
      } catch (error) {
        //
      }
    },
    [api],
  );

  const getAssetMetadata = useCallback(
    async (assetId: MultiAssetId): Promise<TokenMetadata | undefined> => {
      if (!api || !storedChain) return;

      try {
        if (assetId.isAsset) {
          const metadata: PalletAssetsAssetMetadata = await api.query.assets.metadata(assetId.asAsset);
          return formatAssetMetadata(assetId.asAsset, metadata, api);
        } else {
          return formatNativeTokenMetadata(api, storedChain);
        }
      } catch (error) {
        //
      }
    },
    [api, storedChain],
  );

  const getDefaultPool = useCallback(async (): Promise<PoolId | null | undefined> => {
    if (api && api.query.assetConversion) {
      let defaultPoolId: PoolId | null = null;

      try {
        // load all tokens sorted by symbol
        const allTokens: TokenMetadata[] = await fetchAllTokensMetadata();

        // load all pools
        const poolRecords: StorageKey<[PalletAssetConversionPoolId]>[] = await api.query.assetConversion.pools.keys();
        const pools = poolRecords.map(({ args: [id] }) => id[1].asAsset.toNumber());

        // find the first token that has a pool created
        const firstPool = allTokens.find((item) => pools.includes(item.id.asAsset.toNumber()));

        if (firstPool) {
          defaultPoolId = [toMultiAsset(MultiAssets.NATIVE, api), firstPool.id];
        }
      } catch (error) {
        //
      }
      return defaultPoolId;
    }
  }, [api, fetchAllTokensMetadata]);

  const getNativeBalance = useCallback(async () => {
    if (api && activeAccount) {
      try {
        const { data: balance } = await api.query.system.account(activeAccount.address);
        setNativeBalance((balance as PalletBalancesAccountData).free.toBn());
      } catch (error) {
        //
      }
    }
  }, [api, activeAccount]);

  const getNativeMetadata = useCallback(async () => {
    if (api && storedChain) {
      setNativeMetadata(formatNativeTokenMetadata(api, storedChain));
    }
  }, [storedChain, api]);

  const getPoolReserves = useCallback(
    async (asset1: MultiAssetId, asset2: MultiAssetId): Promise<PoolReserves> => {
      let reserves: PoolReserves = [BN_ZERO, BN_ZERO];

      if (api && api.call.assetConversionApi) {
        const res = await api.call.assetConversionApi.getReserves(asset1, asset2);
        if (res && !res.isEmpty) {
          // TODO check later if we can add a proper type for res
          // @ts-ignore
          const [reserve1, reserve2] = res.unwrap();
          reserves = [reserve1.toBn(), reserve2.toBn()];
        }
      }

      return reserves;
    },
    [api],
  );

  const getPools = useCallback(async () => {
    if (api) {
      let pools: PoolInfo[] = [];
      if (api.query.assetConversion) {
        const results: [StorageKey<[PalletAssetConversionPoolId]>, Option<PalletAssetConversionPoolInfo>][] =
          await api.query.assetConversion.pools.entries();

        const promises = results
          .filter(([, data]) => data.isSome)
          .map(
            async ([
              {
                args: [poolId],
              },
              data,
            ]) => {
              const [poolAsset1, poolAsset2] = poolId;

              const lpToken = (data.unwrap() as PalletAssetConversionPoolInfo).lpToken;
              const reserves = await getPoolReserves(poolAsset1, poolAsset2);

              return {
                poolId,
                lpToken,
                reserves,
              };
            },
          );
        pools = await Promise.all(promises);
      }
      setPools(pools);
    }
  }, [api, getPoolReserves]);

  const getAllTokensWithNativeAndSupply = useCallback(async (): Promise<TokenWithSupply[] | undefined> => {
    if (!api || !storedChain) return;

    let result: TokenWithSupply[] = [];

    try {
      result.push({
        ...formatNativeTokenMetadata(api, storedChain),
        supply: (await api.query.balances?.totalIssuance?.().then((r) => r.toBn())) ?? null,
      });

      const [details, metadata]: [TokensDetailsMap | undefined, TokenMetadata[]] = await Promise.all([
        fetchAllTokensDetails(),
        fetchAllTokensMetadata(),
      ]);

      if (details) {
        result = [
          ...result,
          ...metadata.map((token) => ({ ...token, supply: details.get(token.id.asAsset.toNumber())?.supply || null })),
        ];
      }
    } catch (error) {
      //
    }

    return result;
  }, [storedChain, api, fetchAllTokensDetails, fetchAllTokensMetadata]);

  const formatNativeTokenMetadata = (api: ApiPromise, storedChain: Chain): TokenMetadata => ({
    id: toMultiAsset(MultiAssets.NATIVE, api),
    name: storedChain?.nativeTokenName ?? '',
    symbol: api.registry.chainTokens[0],
    decimals: api.registry.chainDecimals[0],
  });

  const formatAssetMetadata = (id: AssetId, data: PalletAssetsAssetMetadata, api: ApiPromise): TokenMetadata => ({
    id: toMultiAsset(id, api),
    name: data.name?.toUtf8() || '',
    symbol: data.symbol?.toUtf8() || '',
    decimals: data.decimals?.toNumber() || 0,
  });

  return {
    addLiquidity,
    availablePoolTokens,
    createPool,
    getAvailablePoolTokens,
    getAssetBalance,
    getAssetMinBalance,
    getAssetMetadata,
    getDefaultPool,
    getNativeBalance,
    getNativeMetadata,
    getPools,
    getPoolReserves,
    getPoolTokenPairs,
    getAllTokens,
    getAllTokensWithNativeAndSupply,
    allTokens,
    nativeBalance,
    nativeMetadata,
    pools,
    poolTokenPairs,
    swap,
  };
};
