import { memo } from 'react';
import styled from 'styled-components';

const SHat = styled.div`
  margin-bottom: 20px;
`;

const STitle = styled.span`
  font-size: 24px;
`;

const Hat = () => (
  <SHat>
    <STitle>Assets Portal</STitle>
  </SHat>
);

export default memo(Hat);
