import { memo } from 'react';

import { NftMetadata } from '@helpers/interfaces';
import { SContentBlockContainer } from '@helpers/reusableStyles';

import Nft from './Nft';

interface NftsViewProps {
  nftsMetadata: NftMetadata[] | null;
}

const NftsView = ({ nftsMetadata }: NftsViewProps) => {
  if (nftsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(nftsMetadata) && nftsMetadata.length === 0) {
    return <>No NFTs found</>;
  }

  return (
    <SContentBlockContainer>
      {nftsMetadata.map((nftMetadata) => (
        <Nft key={nftMetadata.id} nftMetadata={nftMetadata} />
      ))}
    </SContentBlockContainer>
  );
};

export default memo(NftsView);
