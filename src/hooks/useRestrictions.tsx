import { useState } from 'react';

import { RestrictionTypes } from '@helpers/config.ts';
import { RestrictionMessage } from '@helpers/interfaces.ts';

export const useRestrictions = () => {
  const [restrictionMessages, setRestrictionMessages] = useState<RestrictionMessage[] | []>([]);

  const clearRestrictions = () => {
    setRestrictionMessages([]);
  };

  const nftTaken = (id: string) => {
    setRestrictionMessages((restrictionMessages) => [
      ...restrictionMessages,
      {
        type: RestrictionTypes.NFT_TAKEN,
        message: `NFT with ID ${id} is already taken, please retry in a couple of seconds`,
      },
    ]);
  };

  const allNftsMinted = () => {
    setRestrictionMessages((restrictionMessages) => [
      ...restrictionMessages,
      {
        type: RestrictionTypes.ALL_NFTS_MINTED,
        message: `All NFTs in this collection have already been minted`,
      },
    ]);
  };

  const mustBeHolderOf = (holderOfCollectionId: string, collectionId: string) => {
    setRestrictionMessages((restrictionMessages) => [
      ...restrictionMessages,
      {
        type: RestrictionTypes.MUST_BE_HOLDER_OF,
        message: `In order to mint, you must have NFTs from collection "${holderOfCollectionId}", that were not used to mint in collection "${collectionId}"`,
      },
    ]);
  };

  return { restrictionMessages, clearRestrictions, nftTaken, allNftsMinted, mustBeHolderOf };
};
