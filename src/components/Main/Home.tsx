import { memo } from 'react';
import styled from 'styled-components';

const SContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const Home = () => (
  <SContainer>
    <h1>
      Welcome to
      <br />
      Assets portal
    </h1>

    <h2>
      Here you'll be able to create and control your NFTs
      <br />
      To start, please connect
    </h2>
  </SContainer>
);

export default memo(Home);
