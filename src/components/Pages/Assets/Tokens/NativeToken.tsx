import { BN, formatBalance } from '@polkadot/util';
import { memo } from 'react';
import styled from 'styled-components';

import { NativeTokenMetadata } from '@helpers/interfaces';

interface NativeTokenProps {
  metadata: NativeTokenMetadata;
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

const NativeToken = ({ metadata, balance }: NativeTokenProps) => {
  const { name, decimals } = metadata;
  const formattedName = (name || '').toUpperCase();
  const formattedBalance = balance
    ? formatBalance(balance, { decimals, forceUnit: '-', withSi: true, withUnit: formattedName, withZero: false })
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

export default memo(NativeToken);
