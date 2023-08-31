import { memo } from 'react';
import { styled } from 'styled-components';

import Title from '@common/Title.tsx';

import { CssFontRegularL, CssFontRegularM, mediaQueries } from '@helpers/reusableStyles.ts';

import MyNfts from './MyNfts.tsx';

const STitle = styled(Title)`
  max-width: 320px;
  margin: 0 auto;
  text-align: center;

  @media ${mediaQueries.tablet} {
    max-width: 624px;
  }

  @media ${mediaQueries.desktop} {
    max-width: 100%;
  }
`;

const SIntroText = styled.p`
  ${CssFontRegularM}

  max-width: 320px;
  margin: 0 auto 40px;
  text-align: center;
  color: ${({ theme }) => theme.textAndIconsSecondary};

  @media ${mediaQueries.tablet} {
    ${CssFontRegularL}
    max-width: 624px;
  }

  @media ${mediaQueries.laptop} {
    max-width: 820px;
  }

  @media ${mediaQueries.desktop} {
    max-width: 924px;
  }
`;

const Main = () => (
  <>
    <STitle className='main'>Unleashing Polkadot Creative Potential</STitle>
    <SIntroText>
      Whether you&apos;re an artist seeking to venture into the world of NFTs or a marketplace/developer aiming to
      integrate NFT functionality into your projects, this portal is your one-stop destination
    </SIntroText>
    <MyNfts />
  </>
);

export default memo(Main);
