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
  const [ownedNftsFromAnotherCollection, setOwnedNftsFromAnotherCollection] = useState(null);

  const checkHolderOfRestriction = async () => {
    try {
      const config = await getCollectionConfig(collectionId);

      if (config?.mintSettings && Object.values(config.mintSettings.mintType)[0] !== null) {
        const collectionId = (Object.values(config.mintSettings.mintType)[0] as string).toString();
        setHolderOfCollectionId(collectionId);
      } else {
        setHolderOfCollectionId(null);
      }
    } catch (error) {
    }
  };

  // TODO remove all consoles
  const checkEligibilityToMint = useCallback(
    async (holderOfCollectionId: string | null | undefined) => {
      console.log('check eligibility', holderOfCollectionId);
      if (holderOfCollectionId && api !== null) {
        const ownedNftIds = await getNftIds(holderOfCollectionId);
        console.log('ownedNftIds', ownedNftIds)
        if (Array.isArray(ownedNftIds) && ownedNftIds.length > 0) {
          // TODO must check all ownedNftIds
          const tryingAttribute = await api.query.nfts.attribute(holderOfCollectionId, ownedNftIds[0], 'Pallet', null);
          console.log('tryingAttribute', tryingAttribute.toPrimitive());
          console.log('tryingAttribute', tryingAttribute.toJSON());
        }

        const hasNftFromCollection = true;
        if (hasNftFromCollection) {
          setIsEligibleToMint(true);
        } else {
          mustBeHolderOf(holderOfCollectionId);
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
