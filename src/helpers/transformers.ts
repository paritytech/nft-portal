import type { StorageKey, u32 } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';

export const transformKeys = (results: StorageKey<[AccountId32, u32, u32]>[]) => {
  return results.map((item) => {
    const [accountId, collectionId, itemId] = item.args;

    return {
      accountId,
      collectionId,
      itemId,
    };
  });
};

export const gatherUniqueCollectionIds = (keys: StorageKey<[AccountId32, u32, u32]>[]): string[] => {
  const transformedKeys = transformKeys(keys);
  const collectionIds = transformedKeys.map((key) => key.collectionId.toString());

  return [...new Set(collectionIds)];
};
