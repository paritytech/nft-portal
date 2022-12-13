import { useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';

import { SContentBlockContainer } from '../../constants';
import { useNfts } from '../../hooks';
import Nft from './Nft';

const Nfts = () => {
  const { collectionId } = useParams();
  const { getNftsMetadata, nftsMetadata } = useNfts(collectionId || '');

  useEffect(() => {
    if (collectionId) {
      getNftsMetadata();
    }
  }, [getNftsMetadata, collectionId]);

  if (nftsMetadata === null) {
    // TODO add suggestion/link to mint a new NFT
    return <>no nfts found</>;
  }

  return (
    <SContentBlockContainer>
      {nftsMetadata.map((nftMetadata) => (
        <Nft key={nftMetadata.id} nftMetadata={nftMetadata} />
      ))}
    </SContentBlockContainer>
  );
};

export default memo(Nfts);
