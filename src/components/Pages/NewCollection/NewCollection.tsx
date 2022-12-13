import { memo } from 'react';

import { useCollections } from '@hooks/useCollections';
import ActionButton from '@buttons/ActionButton';

const NewCollection = () => {
  const { createNewCollection, isCollectionDataLoading } = useCollections();

  if (isCollectionDataLoading) {
    // TODO a status and callback hook should be implemented, on success redirect to "my collection"
    return <>Creating collection</>;
  }

  return <ActionButton action={createNewCollection}>Mint new collection</ActionButton>;
};

export default memo(NewCollection);
