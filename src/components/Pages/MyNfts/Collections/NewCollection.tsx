import { memo } from 'react';

import ActionButton from '@buttons/ActionButton';

import ModalStatus from '@common/ModalStatus';

import { useCollections } from '@hooks/useCollections';

const NewCollection = () => {
  const { mintCollection } = useCollections();

  return (
    <>
      <ModalStatus />
      <ActionButton action={mintCollection}>Mint collection</ActionButton>
    </>
  );
};

export default memo(NewCollection);
