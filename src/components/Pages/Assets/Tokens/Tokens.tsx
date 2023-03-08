import { memo, useEffect } from 'react';

import { useAssets } from '@hooks/useAssets';

import TokensView from './TokensView';

const Tokens = () => {
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

  useEffect(() => {
    getNativeBalance();
    getNativeMetadata();
    getTokensBalances();
    getTokensMetadata();
  }, [getNativeBalance, getNativeMetadata, getTokensBalances, getTokensMetadata]);

  return (
    <>
      <h2>All Tokens</h2>
      <TokensView
        nativeBalance={nativeBalance}
        nativeMetadata={nativeMetadata}
        tokensBalances={tokensBalances}
        tokensMetadata={tokensMetadata}
      />
    </>
  );
};

export default memo(Tokens);
