import { formatBalance } from '@polkadot/util';
import { ToBn } from '@polkadot/util/types';
import { memo } from 'react';
import styled from 'styled-components';

import { TokenMetadata } from '@helpers/interfaces';

interface TokenProps {
  tokenMetadata: TokenMetadata;
}

const SRow = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 30px;
`;

const SColumn = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SBalance = styled.span`
  text-align: right;
`;

const Token = ({ tokenMetadata }: TokenProps) => {
  const { name, symbol, decimals, details } = tokenMetadata;
  const formattedSymbol = (symbol || '').toUpperCase();
  const supply = details?.supply
    ? formatBalance(details.supply as ToBn, {
        decimals,
        withSi: true,
        withUnit: formattedSymbol,
        withZero: false,
      })
    : '0';

  return (
    <SRow>
      <SColumn>
        <span>{name || ''}</span>
      </SColumn>
      <SColumn>
        <SBalance>{supply}</SBalance>
      </SColumn>
    </SRow>
  );
};

export default memo(Token);
