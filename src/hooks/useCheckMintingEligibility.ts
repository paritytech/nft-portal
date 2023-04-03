import { useCallback, useEffect, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

import { MintTypes } from '@helpers/constants';
import { CollectionConfigHuman } from '@helpers/interfaces';

import { useCollections } from './useCollections';
import { useNfts } from './useNfts';
import { useRestrictions } from './useRestrictions';

export const useCheckMintingEligibility = (collectionId: string) => {
  const { api } = useAccounts();
  const { getCollectionConfig } = useCollections();
  const { getNft, getNftIds, getOwnedNftIds } = useNfts(collectionId);
  const { nftTaken, allNftsMinted, mustBeHolderOf, restrictionMessages, clearRestrictions } = useRestrictions();
  const [isEligibleToMint, setIsEligibleToMint] = useState(false);
  const [ownedNftsFromAnotherCollection, setOwnedNftsFromAnotherCollection] = useState<string[] | null>(null);

  const checkAvailabilityRestriction = useCallback(
    async (nftId: string) => {
      const nft = await getNft(nftId);

      if (nft === null) {
        return true;
      } else {
        nftTaken(nftId);
        return false;
      }
    },
    [getNft, nftTaken],
  );

  const checkSupplyRestriction = useCallback(
    async (config: CollectionConfigHuman) => {
      if (config.maxSupply) {
        const nftIds = await getNftIds();

        if (Array.isArray(nftIds) && config.maxSupply === nftIds.length.toString()) {
          allNftsMinted();
          return false;
        }
      }

      return true;
    },
    [getNftIds, allNftsMinted],
  );

  const checkHolderOfRestriction = useCallback(
    async (config: CollectionConfigHuman) => {
      try {
        if (config.mintSettings && typeof config.mintSettings.mintType === 'object') {
          const holderOfCollectionId = config.mintSettings.mintType[MintTypes.HOLDER_OF];

          const ownedNftIds = await getOwnedNftIds(holderOfCollectionId);
          const availableForClaimingNfts: string[] = [];

          // filter out nfts that were already used to claim
          if (api && Array.isArray(ownedNftIds) && ownedNftIds.length > 0) {
            const calls = ownedNftIds.map((ownedNftId) => {
              return api.query.nfts.attribute.keys(holderOfCollectionId, ownedNftId, 'Pallet');
            });

            const results = await Promise.all(calls);

            results.forEach((attributes, nftIdIndex) => {
              let hasClaimAttribute = false;

              attributes.forEach((attribute) => {
                if (attribute) {
                  const {
                    args: { 3: attributeKey },
                  } = attribute;

                  const claimAttribute = api.createType('PalletNftsPalletAttributes', attributeKey);

                  if (claimAttribute.isUsedToClaim) {
                    hasClaimAttribute = true;
                  }
                }
              });

              // claim attribute exists only when nft was already used
              if (!hasClaimAttribute) {
                availableForClaimingNfts.push(ownedNftIds[nftIdIndex]);
              }
            });
          }

          if (availableForClaimingNfts.length > 0) {
            setOwnedNftsFromAnotherCollection(availableForClaimingNfts);
            return true;
          } else {
            mustBeHolderOf(holderOfCollectionId, collectionId);
            return false;
          }
        } else {
          return true;
        }
      } catch (error) {
        return false;
      }
    },
    [api, collectionId, mustBeHolderOf, getOwnedNftIds],
  );

  const checkEligibilityToMint = useCallback(
    async () => {
      if (api && collectionId) {
        const rawConfig = await getCollectionConfig(collectionId);
        if (rawConfig) {
          const config = rawConfig.toHuman() as unknown as CollectionConfigHuman;

          const checkHolderOf = checkHolderOfRestriction(config);
          const checkSupply = checkSupplyRestriction(config);
          const allChecks = await Promise.all([checkSupply, checkHolderOf]);

          const allChecksPassed = allChecks.every((checkPassed) => checkPassed);

          setIsEligibleToMint(allChecksPassed);
        }
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, collectionId],
  );

  useEffect(() => {
    checkEligibilityToMint();
  }, [checkEligibilityToMint]);

  return {
    restrictionMessages,
    checkAvailabilityRestriction,
    isEligibleToMint,
    ownedNftsFromAnotherCollection,
    clearRestrictions,
  };
};
