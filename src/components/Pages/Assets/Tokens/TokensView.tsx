import { memo } from 'react';

import { SContentBlockContainer } from '@helpers/reusableStyles';

import { useAssets } from '@hooks/useAssets';

import Tokens from './Tokens';

const TokensView = () => {
  const { getTokensBalances, getTokensMetadata, tokensBalances, tokensMetadata } = useAssets();

  return (
    <>
      <h2>All Tokens</h2>
      <Tokens
        getTokensBalances={getTokensBalances}
        tokensBalances={tokensBalances}
        getTokensMetadata={getTokensMetadata}
        tokensMetadata={tokensMetadata}
      />
    </>
  );
};

export default memo(TokensView);
