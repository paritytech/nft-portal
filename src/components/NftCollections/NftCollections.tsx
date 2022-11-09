import { memo, useEffect, useState } from 'react';

import { useAccounts } from '../../Contexts';
import NftCollectionsData from './NftCollectionsData';

const NftCollections = () => {
  const [accountCollectionsIds, setAccountCollectionsIds] = useState<string[] | null>(null);
  const { getAccountCollectionsIds } = useAccounts();

  useEffect(() => {
    const setupNftCollections = async () => {
      const ids = await getAccountCollectionsIds();

      setAccountCollectionsIds(ids);
    };

    setupNftCollections();
  }, [getAccountCollectionsIds]);

  if (accountCollectionsIds === null) {
    return null;
  }

  return <NftCollectionsData collectionsIds={accountCollectionsIds} />;
};

export default memo(NftCollections);
