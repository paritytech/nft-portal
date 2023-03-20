import { BN, formatBalance } from '@polkadot/util';
import { memo } from 'react';
import styled from 'styled-components';

import { TokenMetadata } from '@helpers/interfaces';

interface TokenProps {
  tokenMetadata: TokenMetadata;
  balance: BN | null;
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

const Token = ({ tokenMetadata, balance }: TokenProps) => {
  const { name, symbol, decimals } = tokenMetadata;
  const formattedSymbol = (symbol || '').toUpperCase();
  const formattedBalance = balance
    ? formatBalance(balance, { decimals, forceUnit: '-', withSi: true, withUnit: formattedSymbol, withZero: false })
    : '0';

  return (
    <SRow>
      <SColumn>
        <span>{name || ''}</span>
      </SColumn>
      <SColumn>
        <SBalance>{formattedBalance}</SBalance>
      </SColumn>
    </SRow>
  );
};

export default memo(Token);
