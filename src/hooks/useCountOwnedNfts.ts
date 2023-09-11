import { useEffect, useState } from 'react';

import { useNfts } from './useNfts.ts';

export const useCountOwnedNfts = (id: string) => {
  const { getOwnedNftIdsInCollection } = useNfts(id);
  const [itemCounter, setItemCounter] = useState<number>();

  useEffect(() => {
    const countOwnedItems = async () => {
      const ownedNftIds = await getOwnedNftIdsInCollection();

      if (Array.isArray(ownedNftIds)) {
        setItemCounter(ownedNftIds.length);
      } else {
        setItemCounter(0);
      }
    };

    countOwnedItems();
  }, [getOwnedNftIdsInCollection]);

  const counter = typeof itemCounter !== 'undefined' ? `${itemCounter} items` : '...';

  return counter;
};
