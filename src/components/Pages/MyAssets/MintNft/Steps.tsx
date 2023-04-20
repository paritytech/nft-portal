import { memo } from 'react';
import styled from 'styled-components';

const SStep = styled.div``;

// TODO complete steps functionality
const Steps = () => {
  return (
    <div>
      <SStep>Step 1 - Select Collection</SStep>
      <SStep>Step 2 - Mint NFT</SStep>
    </div>
  );
};

export default memo(Steps);
