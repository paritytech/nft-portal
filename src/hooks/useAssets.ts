import type { Option, StorageKey } from '@polkadot/types';
import type { u128 } from '@polkadot/types-codec';
import type { AssetId } from '@polkadot/types/interfaces';
import type {
  PalletAssetsAssetAccount,
  PalletAssetsAssetDetails,
  PalletAssetsAssetMetadata,
  PalletBalancesAccountData,
} from '@polkadot/types/lookup';
import { BN } from '@polkadot/util';
import { useCallback, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

import type {
  NativeTokenMetadata,
  PalletAssetConversionPoolId,
  PalletAssetConversionPoolInfo,
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
      const issuance: u128 = (await api.query.balances?.totalIssuance()) || null;
      setNativeMetadata({
        name,
        decimals,
        issuance,
      });
    }
  }, [api]);

  const getPools = useCallback(async () => {
    if (api) {
      let pools: PoolInfo[] = [];
      if (api.query.assetConversion) {
        const results: [StorageKey<[PalletAssetConversionPoolId]>, Option<PalletAssetConversionPoolInfo>][] =
          await api.query.assetConversion.pools.entries();

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

              const lpToken = (data.unwrap() as PalletAssetConversionPoolInfo).lpToken;
              let reserves: PoolReserves = [0, 0];

              if (api.call.assetConversionApi) {
                const res = await api.call.assetConversionApi.getReserves(poolAsset1, poolAsset2);
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
        const tokens = await getTokenIds();
        if (!tokens) return;

        const metadataRecords: [StorageKey<[AssetId]>, PalletAssetsAssetMetadata][] =
          await api.query.assets.metadata.entries();
        const detailsRecords: Option<PalletAssetsAssetDetails>[] = await api.query.assets.asset.multi(tokens);

        let details = new Map<number, PalletAssetsAssetDetails | null>();
        if (Array.isArray(detailsRecords) && detailsRecords.length > 0) {
          detailsRecords.forEach((record, index) => {
            const id = tokens[index].toNumber();
            details.set(id, record.unwrapOr(null));
          });
        }

        if (Array.isArray(metadataRecords) && metadataRecords.length > 0) {
          metadata = metadataRecords.map(
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
              details: details.get(id.toNumber()) || null,
            }),
          );
        }
        metadata = metadata.sort((a, b) => a.id - b.id);

        setTokensMetadata(metadata);
      } catch (error) {}
    }
  }, [api, getTokenIds]);

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
