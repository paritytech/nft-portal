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
  height: 100px;
`;

const SColumn = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Token = ({ tokenMetadata, balance }: TokenProps) => {
  const { id, name, symbol, decimals } = tokenMetadata;
  const formattedSymbol = (symbol || '').toUpperCase();
  const formattedBalance = balance
    ? formatBalance(balance, { decimals, forceUnit: '-', withSi: true, withUnit: formattedSymbol, withZero: false })
    : '0';

  return (
    <SRow key={id}>
      <SColumn>
        <span>{name || ''}</span>
      </SColumn>
      <SColumn>
        <span>{formattedBalance}</span>
      </SColumn>
    </SRow>
  );
};

export default memo(Token);
