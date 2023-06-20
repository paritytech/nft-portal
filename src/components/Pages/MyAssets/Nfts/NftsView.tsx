import { memo } from 'react';

import { NftMetadata } from '@helpers/interfaces.ts';
import { SContentBlockContainer } from '@helpers/reusableStyles.ts';

import Nft from './Nft.tsx';

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
