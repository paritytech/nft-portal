import type { Option, StorageKey } from '@polkadot/types';
import type { AssetId } from '@polkadot/types/interfaces';
import type {
  PalletAssetsAssetAccount,
  PalletAssetsAssetMetadata,
  PalletBalancesAccountData,
} from '@polkadot/types/lookup';
import { BN } from '@polkadot/util';
import { useCallback, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

import type {
  NativeTokenMetadata,
  PalletDexPoolId,
  PalletDexPoolInfo,
  PoolInfo,
  TokenBalance,
  TokenMetadata,
} from '@helpers/interfaces';
import { PoolReserves } from '@helpers/interfaces';

export const useAssets = () => {
  const { api, activeAccount } = useAccounts();
  const [nativeBalance, setNativeBalance] = useState<BN | null>(null);
  const [nativeMetadata, setNativeMetadata] = useState<NativeTokenMetadata | null>(null);
  const [tokensMetadata, setTokensMetadata] = useState<TokenMetadata[] | null>(null);
  const [tokensBalances, setTokensBalances] = useState<TokenBalance[] | null>(null);
  const [pools, setPools] = useState<PoolInfo[] | null>(null);

  const getNativeBalance = useCallback(async () => {
    if (api && activeAccount) {
      try {
        const { data: balance } = await api.query.system.account(activeAccount.address);
        setNativeBalance((balance as PalletBalancesAccountData).free.toBn());
      } catch (error) {}
    }
  }, [api, activeAccount]);

  const getNativeMetadata = useCallback(async () => {
    if (api) {
      const decimals = api.registry.chainDecimals[0];
      const name = api.registry.chainTokens[0];
      setNativeMetadata({
        name,
        decimals,
      });
    }
  }, [api]);

  const getPools = useCallback(async () => {
    if (api) {
      let pools: PoolInfo[] = [];
      if (api.query.dex) {
        const results: [StorageKey<[PalletDexPoolId]>, Option<PalletDexPoolInfo>][] =
          await api.query.dex.pools.entries();

        let promises = results
          .filter(([, data]) => data.isSome)
          .map(
            async ([
              {
                args: [poolId],
              },
              data,
            ]) => {
              const [poolAsset1, poolAsset2] = poolId;

              const lpToken = (data.unwrap() as PalletDexPoolInfo).lpToken;
              let reserves: PoolReserves = [0, 0];

              if (api.call.dexApi) {
                const res = await api.call.dexApi.getReserves(poolAsset1, poolAsset2);
                if (res) {
                  reserves = res.toJSON() as PoolReserves;
                }
              }

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
  }, [api]);

  const getTokenIds = useCallback(async () => {
    if (api) {
      const results: StorageKey<[AssetId]>[] = await api.query.assets.asset.keys();
      return results.map(({ args: [id] }) => id);
    }

    return null;
  }, [api]);

  const getTokensBalances = useCallback(async () => {
    if (api && activeAccount) {
      try {
        let balances: TokenBalance[] = [];

        const tokens = await getTokenIds();
        if (!tokens) {
          setTokensBalances(null);
          return;
        }

        const params = tokens.map((tokenId) => [tokenId, activeAccount.address]);
        const results: Option<PalletAssetsAssetAccount>[] = await api.query.assets.account.multi(params);

        if (Array.isArray(results) && results.length > 0) {
          balances = results
            .map((record, index) => ({
              id: tokens[index].toNumber(),
              record,
            }))
            .filter(({ record }) => record.isSome)
            .map(({ id, record }) => ({
              id,
              balance: record.unwrap()?.balance.toBn(),
            }));
        }

        setTokensBalances(balances);
      } catch (error) {}
    }
  }, [api, activeAccount, getTokenIds]);

  const getTokensMetadata = useCallback(async () => {
    if (api) {
      try {
        let metadata: TokenMetadata[] = [];

        const results: [StorageKey<[AssetId]>, PalletAssetsAssetMetadata][] = await api.query.assets.metadata.entries();

        if (Array.isArray(results) && results.length > 0) {
          metadata = results.map(
            ([
              {
                args: [id],
              },
              data,
            ]) => ({
              id: id.toNumber(),
              name: data.name?.toUtf8() || null,
              symbol: data.symbol?.toUtf8() || null,
              decimals: data.decimals?.toNumber() || 0,
            }),
          );
        }
        metadata = metadata.sort((a, b) => a.id - b.id);

        setTokensMetadata(metadata);
      } catch (error) {}
    }
  }, [api]);

  return {
    getNativeBalance,
    getNativeMetadata,
    getPools,
    getTokensBalances,
    getTokensMetadata,
    nativeBalance,
    nativeMetadata,
    pools,
    tokensBalances,
    tokensMetadata,
  };
};
