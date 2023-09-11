import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton.tsx';

import { ViewType } from '@helpers/config.ts';
import { routes } from '@helpers/routes.ts';

interface CollectionActionBlockProps {
  viewType: ViewType;
  collectionId?: string;
}

const CollectionActionBlock = ({ viewType, collectionId }: CollectionActionBlockProps) => {
  const navigate = useNavigate();

  return (
    <>
      {viewType === ViewType.EDIT && (
        <>
          <ActionButton action={() => navigate(routes.myAssets.collectionEdit(collectionId))} className='main'>
            Edit metadata
          </ActionButton>
          <ActionButton action={() => navigate(routes.myAssets.nfts(collectionId))} className='main'>
            View NFTs
          </ActionButton>
        </>
      )}
      {viewType === ViewType.READ && (
        <ActionButton action={() => navigate(routes.myAssets.ownedNfts(collectionId))} className='main'>
          View NFTs
        </ActionButton>
      )}
    </>
  );
};

export default memo(CollectionActionBlock);
