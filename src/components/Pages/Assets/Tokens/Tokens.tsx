import { memo, useEffect } from 'react';

import type { TokenBalance, TokenMetadata } from '@helpers/interfaces';

import Token from './Token';

interface TokensProps {
  getTokensBalances: () => void;
  getTokensMetadata: () => void;
  tokensBalances: TokenBalance[] | null;
  tokensMetadata: TokenMetadata[] | null;
}

const Tokens = ({ getTokensBalances, getTokensMetadata, tokensBalances, tokensMetadata }: TokensProps) => {
  useEffect(() => {
    getTokensBalances();
    getTokensMetadata();
  }, [getTokensBalances, getTokensMetadata]);

  if (tokensMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(tokensMetadata) && tokensMetadata.length === 0) {
    return <>No tokens found</>;
  }

  return (
    <>
      {tokensMetadata.map((tokenMetadata) => {
        const balance = tokensBalances?.find((el) => el.id === tokenMetadata.id)?.balance;
        return <Token key={tokenMetadata.id} tokenMetadata={tokenMetadata} balance={balance || null} />;
      })}
    </>
  );
};

export default memo(Tokens);
