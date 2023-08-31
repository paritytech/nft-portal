import { useEffect, useState } from 'react';

import { useNfts } from './useNfts.ts';

export const useCountOwnedNfts = (id: string) => {
  const { getOwnedNftIdsOfCollection } = useNfts(id);
  const [itemCounter, setItemCounter] = useState<number>();

  useEffect(() => {
    const countOwnedItems = async () => {
      const ownedNftIds = await getOwnedNftIdsOfCollection();

      if (Array.isArray(ownedNftIds)) {
        setItemCounter(ownedNftIds.length);
      } else {
        setItemCounter(0);
      }
    };

    countOwnedItems();
  }, [getOwnedNftIdsOfCollection]);

  const counter = typeof itemCounter !== 'undefined' ? `${itemCounter} items` : '...';

  return counter;
};
