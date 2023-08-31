import { memo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import Title from '@common/Title.tsx';

import { ViewType } from '@helpers/config.ts';
import { routes } from '@helpers/routes.ts';

import { useCollections } from '@hooks/useCollections.ts';
import { useNfts } from '@hooks/useNfts.ts';

import NftsView from '../Nfts/NftsView.tsx';

const OwnedNfts = () => {
  const { collectionId } = useParams();
  const { getNftsMetadata, nftsMetadata } = useNfts(collectionId);
  const { getCollectionMetadata, collectionMetadata } = useCollections();

  useEffect(() => {
    if (collectionId) {
      getNftsMetadata();
      getCollectionMetadata(collectionId);
    }
  }, [collectionId, getCollectionMetadata, getNftsMetadata]);

  return (
    <>
      <Title className='main'>
        <Link to={routes.homepage}>{collectionMetadata ? collectionMetadata.name : ''}</Link>
      </Title>
      <NftsView nftsMetadata={nftsMetadata} viewType={ViewType.READ} />
    </>
  );
};

export default memo(OwnedNfts);
