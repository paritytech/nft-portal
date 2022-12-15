import { memo } from 'react';

import ActionButton from '@buttons/ActionButton';

interface NewCollectionProps {
  createNewCollection: () => void;
  isCollectionDataSaving: boolean;
}

const NewCollection = ({ createNewCollection, isCollectionDataSaving }: NewCollectionProps) => (
  <ActionButton action={createNewCollection} isDisabled={isCollectionDataSaving}>
    {isCollectionDataSaving ? 'Minting collection' : 'Mint new collection'}
  </ActionButton>
);

export default memo(NewCollection);
