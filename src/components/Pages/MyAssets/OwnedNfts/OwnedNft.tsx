import { memo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';
import Title from '@common/Title.tsx';

import { CssFontRegularL, CssFontSemiBoldXL, mediaQueries } from '@helpers/reusableStyles.ts';

import { useNfts } from '@hooks/useNfts.ts';

const SDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;

  > div {
    width: 100%;
    max-width: 500px;
  }

  @media ${mediaQueries.tablet} {
    flex-direction: row;

    > div {
      width: 50%;
    }
  }
`;

const SDetailsBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const SName = styled.div`
  ${CssFontSemiBoldXL}
`;

const SDescription = styled.p`
  ${CssFontRegularL}
`;

const OwnedNft = () => {
  const { collectionId, nftId } = useParams();
  const { getNftMetadata, nftMetadata, isNftDataLoading } = useNfts(collectionId);

  useEffect(() => {
    if (collectionId && nftId) {
      getNftMetadata(nftId);
    }
  }, [collectionId, nftId, getNftMetadata]);

  if (isNftDataLoading) {
    return <>loading...</>;
  }

  return (
    <>
      <Title className='main'>
        <Link to='..'>ID #{nftId}</Link>
      </Title>

      <SDisplay>
        <ShowImage imageCid={nftMetadata?.image} altText={nftMetadata?.description} />
        <SDetailsBlock>
          <SName>{nftMetadata?.name}</SName>
          <SDescription>{nftMetadata?.description}</SDescription>
        </SDetailsBlock>
      </SDisplay>
    </>
  );
};

export default memo(OwnedNft);
