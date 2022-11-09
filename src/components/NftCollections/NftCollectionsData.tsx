import { memo } from 'react';

const NftCollectionsData = ({ collectionsIds }: { collectionsIds: string[] }) => {
  // TODO gather full collection data

  return (
    <>
      {collectionsIds.map((collectionId: string) => {
        return <div key={collectionId}>{collectionId}</div>;
      })}
    </>
  );
};

export default memo(NftCollectionsData);
