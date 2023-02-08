import { memo } from 'react';

import { NftMetadata } from '@helpers/interfaces';

import Nft from './Nft';

interface NftsProps {
  nftsMetadata: NftMetadata[] | null;
}

const Nfts = ({ nftsMetadata }: NftsProps) => {
  if (nftsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(nftsMetadata) && nftsMetadata.length === 0) {
    return <>No NFTs found</>;
  }

  return (
    <>
      {nftsMetadata.map((nftMetadata) => (
        <Nft key={nftMetadata.id} nftMetadata={nftMetadata} />
      ))}
    </>
  );
};

export default memo(Nfts);
