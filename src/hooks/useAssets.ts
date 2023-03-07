import type { Option, StorageKey } from '@polkadot/types';
import type { AssetId } from '@polkadot/types/interfaces';
import type { PalletAssetsAssetAccount, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';
import { useCallback, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

import type { TokenBalance, TokenMetadata } from '@helpers/interfaces';

export const useAssets = () => {
  const { api, activeAccount } = useAccounts();
  const [tokensMetadata, setTokensMetadata] = useState<TokenMetadata[] | null>(null);
  const [tokensBalances, setTokensBalances] = useState<TokenBalance[] | null>(null);

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
          console.log(balances);
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
    getTokensBalances,
    getTokensMetadata,
    tokensBalances,
    tokensMetadata,
  };
};
