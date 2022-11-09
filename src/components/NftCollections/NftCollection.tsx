import { memo } from 'react';

import { INftCollection } from '../../constants';

interface NftCollectionProps {
  collection: INftCollection;
}

const NftCollection = ({ collection }: NftCollectionProps) => {
  // TODO display final nft collection data
  const { name } = collection;

  return (
    <div>
      <span>{name}</span>
    </div>
  );
};

export default memo(NftCollection);
