import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import ShowImage from '@common/ShowImage';
import Step from '@common/Step';

import { sizeMatters } from '@helpers/utilities';

import { useCollections } from '@hooks/useCollections';

const SMintNftSteps = styled.div`
  display: flex;
  gap: 8px;
`;

const SSelectedCollection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 2px 0 16px;
  background-color: ${({ theme }) => theme.fill6};
  border-radius: 24px;
`;

const MintNftSteps = () => {
  const { collectionId } = useParams();
  const { getCollectionMetadata, collectionMetadata } = useCollections();

  useEffect(() => {
    getCollectionMetadata(collectionId || '');
  }, [collectionId, getCollectionMetadata]);

  const selectedCollectionLabel = collectionMetadata ? (
    <SSelectedCollection>
      {sizeMatters(collectionMetadata.name, 20)}
      {collectionMetadata?.image && <ShowImage imageCid={collectionMetadata.image} altText={collectionMetadata.name} />}
    </SSelectedCollection>
  ) : (
    'Select Collection'
  );

  return (
    <SMintNftSteps>
      <Step counter='1' className={collectionId ? 'disabled' : 'active'}>
        {selectedCollectionLabel}
      </Step>
      <Step counter='2' className={collectionId ? 'active' : 'disabled'}>
        Mint NFT
      </Step>
    </SMintNftSteps>
  );
};

export default memo(MintNftSteps);
