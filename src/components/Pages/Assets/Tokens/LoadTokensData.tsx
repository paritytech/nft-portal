import { isEmpty } from 'lodash';
import { memo, useEffect, useState } from 'react';

import { TokenWithSupply } from '@helpers/interfaces';

import { useAssets } from '@hooks/useAssets';

import Tokens from './Tokens';

const LoadTokensData = () => {
  const [tokens, setTokens] = useState<TokenWithSupply[] | null>(null);
  const { getAllTokensWithNativeAndSupply } = useAssets();

  useEffect(() => {
    getAllTokensWithNativeAndSupply().then(setTokens);
  }, [getAllTokensWithNativeAndSupply]);

  if (isEmpty(tokens)) {
    return <>Gathering data... please wait</>;
  }

  return <Tokens tokens={tokens as TokenWithSupply[]} />;
};

export default memo(LoadTokensData);
