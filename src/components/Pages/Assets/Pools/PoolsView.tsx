import EditIcon from '@assets/edit-icon.svg';
import { formatBalance } from '@polkadot/util';
import { memo } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import type { NativeTokenMetadata, TokenMetadata } from '@helpers/interfaces';
import { PoolInfo } from '@helpers/interfaces';
import { SContentBlock } from '@helpers/reusableStyles';
import { SCard, SCardEdit, SColumn, SRow } from '@helpers/styledComponents';

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

  if (Array.isArray(pools) && pools.length === 0) {
    return <>No pools found</>;
  }

  return (
    <>
      {Array.isArray(pools) &&
        pools.map((pools) => {
          const poolInfo = pools.poolId.map((asset, index) => {
            const reserve = pools.reserves[index];
            let symbol = nativeMetadata.name;
            let decimals = nativeMetadata.decimals;

            if (asset.isAsset) {
              const tokenInfo = tokensMetadata.find(({ id }) => id === asset.asAsset.toPrimitive());
              if (!tokenInfo) return null;
              symbol = tokenInfo.symbol;
              decimals = tokenInfo.decimals;
            }

            const formattedReserve = formatBalance(reserve, {
              decimals,
              withUnit: (symbol || '').toUpperCase(),
              withSi: true,
              withZero: false,
            });

            return {
              symbol,
              decimals,
              formattedReserve,
            };
          });
          if (poolInfo[0] === null || poolInfo[1] === null) return <></>;

          return (
            <SPoolBlock key={pools.lpToken.toPrimitive()}>
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
                        <span>{(poolInfo[0].symbol || '').toUpperCase()}</span>
                      </SColumn>
                      <SColumn>
                        <SReserve>{poolInfo[0].formattedReserve}</SReserve>
                      </SColumn>
                    </SRow>
                    <SRow>
                      <SColumn>
                        <span>{(poolInfo[1].symbol || '').toUpperCase()}</span>
                      </SColumn>
                      <SColumn>
                        <SReserve>{poolInfo[1].formattedReserve}</SReserve>
                      </SColumn>
                    </SRow>
                  </SPoolInfo>
                </Card.Body>
              </SCard>
            </SPoolBlock>
          );
        })}
    </>
  );
};

export default memo(PoolsView);
