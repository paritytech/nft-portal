import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import ActionButton from '@buttons/ActionButton.tsx';

import { ViewType } from '@helpers/config.ts';
import { routes } from '@helpers/routes.ts';

interface ActionBlockProps {
  viewType: ViewType;
  collectionId?: string;
  nftId: string;
}

const ActionBlock = ({ viewType, collectionId, nftId }: ActionBlockProps) => {
  const navigate = useNavigate();

  return (
    <>
      {viewType === ViewType.EDIT && (
        <ActionButton action={() => navigate(routes.myAssets.nftEdit(collectionId, nftId))} className='main'>
          Edit
        </ActionButton>
      )}
      {viewType === ViewType.READ && (
        <ActionButton action={() => navigate(routes.myAssets.ownedNft(collectionId, nftId))} className='main'>
          View
        </ActionButton>
      )}
    </>
  );
};

export default memo(ActionBlock);
