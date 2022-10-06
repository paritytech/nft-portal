import { memo } from 'react';
import styled from 'styled-components';

const STitle = styled.div`
  text-align: center;
`;

const Home = () => (
  <div>
    <STitle>
      <h1>
        Welcome to
        <br />
        Assets portal
      </h1>

      <h2>Here you'll be able to create and control your NFTs<br />To start, please connect</h2>
    </STitle>
  </div>
);

export default memo(Home);
