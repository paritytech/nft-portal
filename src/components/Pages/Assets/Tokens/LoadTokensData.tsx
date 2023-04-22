import { isEmpty } from 'lodash';
import { memo, useEffect, useState } from 'react';

import { TokenWithSupply } from '@helpers/interfaces';

import { useAssets } from '@hooks/useAssets';

import Tokens from './Tokens';

const LoadTokensData = () => {
  const [tokens, setTokens] = useState<TokenWithSupply[] | null>(null);
  const { getAllTokensWithSupply } = useAssets();

  useEffect(() => {
    getAllTokensWithSupply().then(setTokens);
  }, [getAllTokensWithSupply]);

  if (isEmpty(tokens)) {
    return <>Gathering data... please wait</>;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return <Tokens tokens={tokens!} />;
};

export default memo(LoadTokensData);
