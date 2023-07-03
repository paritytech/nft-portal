import { useEffect, useState } from 'react';

import { useNfts } from './useNfts.ts';

export const useCountOwnedNfts = (id: string) => {
  const { getOwnedNftIds } = useNfts(id);
  const [itemCounter, setItemCounter] = useState<number>();

  useEffect(() => {
    const countOwnedItems = async () => {
      const ownedNftIds = await getOwnedNftIds();

      if (Array.isArray(ownedNftIds)) {
        setItemCounter(ownedNftIds.length);
      } else {
        setItemCounter(0);
      }
    };

    countOwnedItems();
  }, [getOwnedNftIds]);

  const counter = typeof itemCounter !== 'undefined' ? `${itemCounter} items` : '...';

  return counter;
};
