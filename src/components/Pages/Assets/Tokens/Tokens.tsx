import { memo } from 'react';

import type { TokenWithSupply } from '@helpers/interfaces';

import Token from './Token';

interface TokensProps {
  tokens: TokenWithSupply[];
}

const Tokens = ({ tokens }: TokensProps) => {
  return (
    <>
      {tokens.map((token) => (
        <Token key={token.id} token={token} />
      ))}
    </>
  );
};

export default memo(Tokens);
