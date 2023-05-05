import { isEmpty } from 'lodash';
import { memo, useEffect, useState } from 'react';

import { TokenWithSupply } from '@helpers/interfaces';

import { useAssets } from '@hooks/useAssets';

import Token from '@pages/Assets/Tokens/Token';

const Tokens = () => {
  const [tokens, setTokens] = useState<TokenWithSupply[]>();
  const { getAllTokensWithNativeAndSupply } = useAssets();

  useEffect(() => {
    getAllTokensWithNativeAndSupply().then(setTokens);
  }, [getAllTokensWithNativeAndSupply]);

  if (!tokens || isEmpty(tokens)) {
    return <>Gathering data... please wait</>;
  }

  return (
    <>
      {tokens.map((token) => (
        <Token key={token.id.toHex()} token={token} />
      ))}
    </>
  );
};

export default memo(Tokens);
