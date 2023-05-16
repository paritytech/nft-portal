import SwapWidget from 'components/Widgets/SwapWidget.tsx';
import { memo } from 'react';
import { styled } from 'styled-components';

import SectionTitle from '@common/SectionTitle.tsx';
import Title from '@common/Title.tsx';

import { routes } from '@helpers/routes.ts';

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
  max-width: 380px;
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

      <SSideContent>
        <SwapWidget />
      </SSideContent>
    </SMyAssets>
  );
};

export default memo(MyAssets);
