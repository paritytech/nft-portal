import { memo } from 'react';
import styled from 'styled-components';

import SectionTitle from '@common/SectionTitle';
import Title from '@common/Title';

import { routes } from '@helpers/routes';

const SMyAssets = styled.div`
  display: flex;
  gap: 50px;
`;

const SMainContent = styled.div`
  flex-grow: 2;

  section {
    margin-bottom: 40px;
  }
`;

const SSideContent = styled.aside`
  flex-grow: 1;
`;

const MyAssets = () => {
  return (
    <SMyAssets>
      <SMainContent>
        <section>
          <SectionTitle title={<Title className='L'>My collections</Title>} route={routes.myAssets.collections} />
        </section>
        <section>
          <SectionTitle title={<Title className='L'>My liquidity pools</Title>} route={routes.myAssets.pools} />
        </section>
      </SMainContent>

      <SSideContent>Swapper (under construction)</SSideContent>
    </SMyAssets>
  );
};

export default memo(MyAssets);
