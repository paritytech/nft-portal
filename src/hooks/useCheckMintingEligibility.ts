import { useCallback, useEffect, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

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

  const checkHolderOfRestriction = async () => {
    try {
      const config = await getCollectionConfig(collectionId);

      if (config?.mintSettings && Object.values(config.mintSettings.mintType)[0] !== null) {
        const collectionId = (Object.values(config.mintSettings.mintType)[0] as string).toString();
        setHolderOfCollectionId(collectionId);
      } else {
        setHolderOfCollectionId(null);
      }
    } catch (error) {}
  };

  const checkEligibilityToMint = useCallback(
    async (holderOfCollectionId: string | null | undefined) => {
      if (holderOfCollectionId && api !== null) {
        const ownedNftIds = await getNftIds(holderOfCollectionId);
        const availableForClaimingNfts: string[] = [];

        // filter out nfts that were already used to claim
        if (Array.isArray(ownedNftIds) && ownedNftIds.length > 0) {
          const calls = ownedNftIds.map((ownedNftId) => {
            // TODO need to find a way to get the "key" (e.g. 0x0001000000)
            return api.query.nfts.attribute(holderOfCollectionId, ownedNftId, 'Pallet', '0x0001000000');
          });

          const results = await Promise.all(calls);

          results.forEach((usedToClaim, index) => {
            const data = usedToClaim.toPrimitive();

            // claim attribute exists only when nft was already used
            if (data === null) {
              availableForClaimingNfts.push(ownedNftIds[index]);
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
    checkHolderOfRestriction();
  }, []);

  useEffect(() => {
    checkEligibilityToMint(holderOfCollectionId);
  }, [holderOfCollectionId]);

  return {
    holderOfCollectionId,
    holderOfStatusMessage: contextualStatusMessage,
    isEligibleToMint,
    ownedNftsFromAnotherCollection,
  };
};
