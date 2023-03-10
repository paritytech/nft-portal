import { useCallback, useEffect, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

import { MintTypes } from '@helpers/constants';
import { CollectionConfigHuman } from '@helpers/interfaces';

import { useCollections } from './useCollections';
import { useNfts } from './useNfts';
import { useStatus } from './useStatus';

export const useCheckMintingEligibility = (collectionId: string) => {
  const { api } = useAccounts();
  const { getCollectionConfig } = useCollections();
  const { getNftIds } = useNfts(collectionId);
  const { mustBeHolderOf, contextualStatusMessage } = useStatus();
  const [holderOfCollectionId, setHolderOfCollectionId] = useState<undefined | null | string>();
  const [isEligibleToMint, setIsEligibleToMint] = useState(false);
  const [ownedNftsFromAnotherCollection, setOwnedNftsFromAnotherCollection] = useState<string[] | null>(null);

  const checkHolderOfRestriction = useCallback(async () => {
    try {
      const rawConfig = await getCollectionConfig(collectionId);
      if (rawConfig) {
        const config = rawConfig.toHuman() as unknown as CollectionConfigHuman;

        if (config.mintSettings && typeof config.mintSettings.mintType === 'object') {
          setHolderOfCollectionId(config.mintSettings.mintType[MintTypes.HOLDER_OF]);
        } else {
          setHolderOfCollectionId(null);
        }
      }
    } catch (error) {}
  }, [collectionId, getCollectionConfig]);

  const checkEligibilityToMint = useCallback(
    async (holderOfCollectionId: string | null | undefined) => {
      if (holderOfCollectionId && api !== null) {
        const ownedNftIds = await getNftIds(holderOfCollectionId);
        const availableForClaimingNfts: string[] = [];

        // filter out nfts that were already used to claim
        if (Array.isArray(ownedNftIds) && ownedNftIds.length > 0) {
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
                // TODO uncomment when @polkadot/api is updated with the enum PalletAttributes
                // if (attributeKey.isUsedToClaim()) {
                // hasClaimAttribute = true;
                // }
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
          setIsEligibleToMint(true);
        } else {
          mustBeHolderOf(holderOfCollectionId, collectionId);
          setIsEligibleToMint(false);
        }
      }

      if (holderOfCollectionId === null) {
        setIsEligibleToMint(true);
      }
    },
    [api, getNftIds, mustBeHolderOf, collectionId],
  );

  useEffect(() => {
    if (api) {
      checkHolderOfRestriction();
    }
  }, [api, checkHolderOfRestriction]);

  useEffect(() => {
    checkEligibilityToMint(holderOfCollectionId);
  }, [holderOfCollectionId, checkEligibilityToMint]);

  return {
    holderOfCollectionId,
    holderOfStatusMessage: contextualStatusMessage,
    isEligibleToMint,
    ownedNftsFromAnotherCollection,
  };
};
