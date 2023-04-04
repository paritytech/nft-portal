import { memo, useEffect } from 'react';

import { useAssets } from '@hooks/useAssets';

import TokensView from './TokensView';

const Tokens = () => {
  const { getNativeMetadata, getTokensMetadata, nativeMetadata, tokensMetadata } = useAssets();

  useEffect(() => {
    getNativeMetadata();
    getTokensMetadata();
  }, [getNativeMetadata, getTokensMetadata]);

  return (
    <>
      <h2>All Tokens</h2>
      <TokensView nativeMetadata={nativeMetadata} tokensMetadata={tokensMetadata} />
    </>
  );
};

export default memo(Tokens);
