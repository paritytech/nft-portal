import { formatBalance } from '@polkadot/util';
import { isEmpty } from 'lodash';
import { memo } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { TokenMetadata } from '@helpers/interfaces';
import { PoolInfo } from '@helpers/interfaces';
import { SColumn, SContentBlock, SRow } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';
import { SCard, SCardEdit } from '@helpers/styledComponents';
import { multiAssetToParam, sortStrings } from '@helpers/utilities';

import PlusIcon from '@images/icons/plus.svg';

interface PoolsViewProps {
  pools: PoolInfo[] | null;
  allTokens: TokenMetadata[] | null;
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

interface PoolAsset extends TokenMetadata {
  formattedReserve: string;
}

type PoolAssets = [PoolAsset, PoolAsset][];

const PoolsView = ({ pools, allTokens }: PoolsViewProps) => {
  if (pools === null || allTokens === null) {
    return <>Gathering data... please wait</>;
  }

  if (isEmpty(pools)) {
    return <>No pools found</>;
  }

  const poolsWithInfo = pools
    .map((pool) => {
      return pool.poolId.map((asset, index) => {
        const reserve = pool.reserves[index];
        const tokenInfo = allTokens.find(({ id }) => id.eq(asset));
        if (!tokenInfo) return null;

        const { symbol, decimals } = tokenInfo;
        const formattedReserve = formatBalance(reserve, {
          decimals,
          withUnit: symbol.toUpperCase(),
          withSi: true,
          withZero: false,
        });

        return {
          ...tokenInfo,
          formattedReserve,
        };
      });
    })
    .filter((poolInfo) => poolInfo[0] !== null && poolInfo[1] !== null) as PoolAssets;
  poolsWithInfo.sort((poolInfo1, poolInfo2) => sortStrings(poolInfo1[1].symbol, poolInfo2[1].symbol));

  return (
    <>
      {poolsWithInfo.map((poolInfo) => (
        <SPoolBlock key={`${poolInfo[0].symbol}-${poolInfo[1].symbol}`}>
          <SCard>
            <Card.Body>
              <SCardEdit className='text-muted'>
                <span>Tokens Locked</span>
                <Link
                  to={routes.discover.addLiquidity(
                    multiAssetToParam(poolInfo[0].id),
                    multiAssetToParam(poolInfo[1].id),
                  )}
                >
                  <PlusIcon />
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
