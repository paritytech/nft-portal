import type { Option, StorageKey } from '@polkadot/types';
import type { AssetId } from '@polkadot/types/interfaces';
import type {
  PalletAssetsAssetAccount,
  PalletAssetsAssetDetails,
  PalletBalancesAccountData,
} from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import { ToBn } from '@polkadot/util/types';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAccounts } from '@contexts/AccountsContext';
import { useModalStatus } from '@contexts/ModalStatusContext';

import { ModalStatusTypes, MultiAssets, StatusMessages } from '@helpers/constants';
import { handleError } from '@helpers/handleError';
import type {
  DetailsRecords,
  MetadataRecords,
  MultiAsset,
  NativeTokenMetadata,
  PalletAssetConversionPoolId,
  PalletAssetConversionPoolInfo,
  PoolInfo,
  PoolReserves,
  TokenBalance,
  TokenMetadata,
} from '@helpers/interfaces';
import { routes } from '@helpers/routes';

export const useAssets = () => {
  const navigate = useNavigate();
  const { api, activeAccount, activeWallet } = useAccounts();
  const { openModalStatus, setStatus, setAction } = useModalStatus();
  const [freePoolTokens, setFreePoolTokens] = useState<TokenMetadata[] | null>(null);
  const [nativeBalance, setNativeBalance] = useState<BN | null>(null);
  const [nativeMetadata, setNativeMetadata] = useState<NativeTokenMetadata | null>(null);
  const [tokensMetadata, setTokensMetadata] = useState<TokenMetadata[] | null>(null);
  const [tokensBalances, setTokensBalances] = useState<TokenBalance[] | null>(null);
  const [pools, setPools] = useState<PoolInfo[] | null>(null);

  const createPool = useCallback(
    async (tokenId: AssetId) => {
      if (api && activeAccount && activeWallet) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          const token1: MultiAsset = MultiAssets.NATIVE;
          const token2: MultiAsset = { [MultiAssets.ASSET]: tokenId };

          const unsub = await api.tx.assetConversion
            .createPool(token1, token2)
            .signAndSend(activeAccount.address, { signer: activeWallet.signer }, ({ events, status }) => {
              if (status.isReady) {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.POOL_CREATION });
              }

              if (status.isFinalized) {
                unsub();

                events.some(({ event: { data, method } }) => {
                  if (method === 'PoolCreated') {
                    const createdPoolId = data.poolId as PalletAssetConversionPoolId;

                    if (createdPoolId && createdPoolId[1].isAsset && createdPoolId[1].asAsset.eq(tokenId)) {
                      setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.POOL_CREATED });
                      setAction(() => () => navigate(routes.discover.pools));
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

  const getFreePoolTokens = useCallback(async () => {
    if (api && api.query.assetConversion) {
      let freePoolTokens: TokenMetadata[] = [];
      try {
        // load all tokens
        const allTokens: MetadataRecords = await api.query.assets.metadata.entries();

        // load all pools
        const poolRecords: StorageKey<[PalletAssetConversionPoolId]>[] = await api.query.assetConversion.pools.keys();
        const pools = poolRecords.map(({ args: [id] }) => id[1].asAsset.toNumber());

        // subtract one from another
        freePoolTokens = allTokens
          .map(
            ([
              {
                args: [id],
              },
              data,
            ]) => ({
              id,
              name: data.name?.toUtf8() || null,
              symbol: data.symbol?.toUtf8() || null,
              decimals: data.decimals?.toNumber() || 0,
              details: null,
            }),
          )
          .filter((item) => !pools.includes(item.id.toNumber()))
          .sort((a, b) => a.id - b.id);
      } catch (error) {
        //
      }

      setFreePoolTokens(freePoolTokens);
    }
  }, [api]);

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
    if (api) {
      const decimals = api.registry.chainDecimals[0];
      const name = api.registry.chainTokens[0];
      const issuance = (await api.query.balances?.totalIssuance?.()) ?? null;
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
              balance: record.unwrap()?.balance as ToBn,
            }));
        }

        setTokensBalances(balances);
      } catch (error) {
        //
      }
    }
  }, [api, activeAccount, getTokenIds]);

  const getTokensMetadata = useCallback(async () => {
    if (api) {
      try {
        let metadata: TokenMetadata[] = [];
        const tokens = await getTokenIds();
        if (!tokens) return;

        const [metadataRecords, detailsRecords]: [MetadataRecords, DetailsRecords] = await Promise.all([
          api.query.assets.metadata.entries(),
          api.query.assets.asset.multi(tokens),
        ]);

        const details = new Map<number, PalletAssetsAssetDetails | null>();
        if (Array.isArray(detailsRecords) && detailsRecords.length > 0) {
          detailsRecords.forEach((record, index) => {
            const id = tokens[index].toNumber();
            details.set(id, record.unwrapOr(null));
          });
        }

        if (Array.isArray(metadataRecords) && metadataRecords.length > 0) {
          metadata = metadataRecords
            .map(
              ([
                {
                  args: [id],
                },
                data,
              ]) => ({
                id,
                name: data.name?.toUtf8() || null,
                symbol: data.symbol?.toUtf8() || null,
                decimals: data.decimals?.toNumber() || 0,
                details: details.get(id.toNumber()) || null,
              }),
            )
            .sort((a, b) => a.id.toNumber() - b.id.toNumber());
        }

        setTokensMetadata(metadata);
      } catch (error) {
        //
      }
    }
  }, [api, getTokenIds]);

  return {
    createPool,
    freePoolTokens,
    getFreePoolTokens,
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
