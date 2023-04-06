import { formatBalance } from '@polkadot/util';
import { memo } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import type { NativeTokenMetadata, TokenMetadata } from '@helpers/interfaces';
import { PoolInfo } from '@helpers/interfaces';
import { SColumn, SContentBlock, SRow } from '@helpers/reusableStyles';
import { SCard, SCardEdit } from '@helpers/styledComponents';
import { sortStrings } from '@helpers/utilities';

import EditIcon from '@images/icons/edit.svg';

interface PoolsViewProps {
  pools: PoolInfo[] | null;
  nativeMetadata: NativeTokenMetadata | null;
  tokensMetadata: TokenMetadata[] | null;
}

const SPoolBlock = styled(SContentBlock)`
  flex: 1;
  width: auto;
  align-items: normal;
`;

const SPoolInfo = styled.div`
  margin-top: 20px;
`;

const SReserve = styled.span`
  text-align: right;
`;

const PoolsView = ({ pools, nativeMetadata, tokensMetadata }: PoolsViewProps) => {
  const { theme } = useAccounts();
  if (pools === null || nativeMetadata === null || tokensMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (!Array.isArray(pools) || pools.length === 0) {
    return <>No pools found</>;
  }

  const poolsWithInfo = pools
    .map((pool) => {
      return pool.poolId.map((asset, index) => {
        const reserve = pool.reserves[index];
        let symbol = nativeMetadata.name;
        let decimals = nativeMetadata.decimals;

        if (asset.isAsset) {
          const tokenInfo = tokensMetadata.find(({ id }) => id.eq(asset.asAsset));
          if (!tokenInfo) return null;
          symbol = tokenInfo.symbol;
          decimals = tokenInfo.decimals;
        }
        symbol = symbol || '';

        const formattedReserve = formatBalance(reserve, {
          decimals,
          withUnit: symbol.toUpperCase(),
          withSi: true,
          withZero: false,
        });

        return {
          symbol,
          decimals,
          formattedReserve,
        };
      });
    })
    .filter((poolInfo) => poolInfo[0] && poolInfo[1])
    .sort((poolInfo1, poolInfo2) => sortStrings(poolInfo1[1].symbol, poolInfo2[1].symbol));

  return (
    <>
      {poolsWithInfo.map((poolInfo) => (
        <SPoolBlock key={`${poolInfo[0].symbol}-${poolInfo[1].symbol}`}>
          <SCard activetheme={theme}>
            <Card.Body>
              <SCardEdit className='text-muted'>
                <span>Tokens Locked</span>
                <Link to='1'>
                  <EditIcon />
                </Link>
              </SCardEdit>

              <SPoolInfo>
                <SRow>
                  <SColumn>
                    <span>{poolInfo[0].symbol.toUpperCase()}</span>
                  </SColumn>
                  <SColumn>
                    <SReserve>{poolInfo[0].formattedReserve}</SReserve>
                  </SColumn>
                </SRow>
                <SRow>
                  <SColumn>
                    <span>{poolInfo[1].symbol.toUpperCase()}</span>
                  </SColumn>
                  <SColumn>
                    <SReserve>{poolInfo[1].formattedReserve}</SReserve>
                  </SColumn>
                </SRow>
              </SPoolInfo>
            </Card.Body>
          </SCard>
        </SPoolBlock>
      ))}
    </>
  );
};

export default memo(PoolsView);
