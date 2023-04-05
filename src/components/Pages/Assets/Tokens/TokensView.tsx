import { memo } from 'react';

import type { NativeTokenMetadata, TokenMetadata } from '@helpers/interfaces';

import NativeToken from './NativeToken';
import Token from './Token';

interface TokensViewProps {
  nativeMetadata: NativeTokenMetadata | null;
  tokensMetadata: TokenMetadata[] | null;
}

const TokensView = ({ nativeMetadata, tokensMetadata }: TokensViewProps) => {
  if (tokensMetadata === null && nativeMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  return (
    <>
      {nativeMetadata && <NativeToken metadata={nativeMetadata} />}
      {Array.isArray(tokensMetadata) &&
        tokensMetadata.map((tokenMetadata) => <Token key={tokenMetadata.id} tokenMetadata={tokenMetadata} />)}
    </>
  );
};

export default memo(TokensView);
