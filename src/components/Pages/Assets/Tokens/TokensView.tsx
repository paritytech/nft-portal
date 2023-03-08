import { memo } from 'react';

import { useAssets } from '@hooks/useAssets';

import Tokens from './Tokens';

const TokensView = () => {
  const {
    getNativeBalance,
    getNativeMetadata,
    getTokensBalances,
    getTokensMetadata,
    nativeBalance,
    nativeMetadata,
    tokensBalances,
    tokensMetadata,
  } = useAssets();

  return (
    <>
      <h2>All Tokens</h2>
      <Tokens
        getNativeBalance={getNativeBalance}
        getNativeMetadata={getNativeMetadata}
        getTokensBalances={getTokensBalances}
        getTokensMetadata={getTokensMetadata}
        nativeBalance={nativeBalance}
        nativeMetadata={nativeMetadata}
        tokensBalances={tokensBalances}
        tokensMetadata={tokensMetadata}
      />
    </>
  );
};

export default memo(TokensView);
