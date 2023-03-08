import { BN } from '@polkadot/util';
import { memo } from 'react';

import type { NativeTokenMetadata, TokenBalance, TokenMetadata } from '@helpers/interfaces';

import NativeToken from './NativeToken';
import Token from './Token';

interface TokensViewProps {
  nativeBalance: BN | null;
  nativeMetadata: NativeTokenMetadata | null;
  tokensBalances: TokenBalance[] | null;
  tokensMetadata: TokenMetadata[] | null;
}

const TokensView = ({ nativeBalance, nativeMetadata, tokensBalances, tokensMetadata }: TokensViewProps) => {
  if (tokensMetadata === null || nativeMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(tokensMetadata) && tokensMetadata.length === 0) {
    return <>No tokens found</>;
  }

  return (
    <>
      {nativeMetadata && <NativeToken metadata={nativeMetadata} balance={nativeBalance} />}
      {Array.isArray(tokensMetadata) &&
        tokensMetadata.map((tokenMetadata) => {
          const balance = tokensBalances?.find((el) => el.id === tokenMetadata.id)?.balance;
          return <Token key={tokenMetadata.id} tokenMetadata={tokenMetadata} balance={balance || null} />;
        })}
    </>
  );
};

export default memo(TokensView);
