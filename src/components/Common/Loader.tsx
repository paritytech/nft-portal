import { memo } from 'react';
import { styled } from 'styled-components';

import PolkadotIcon from '@images/icons/polkadot.svg';

const SSpinner = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    width: 100px;
  }

  &.spin-me-right-round svg {
    animation-name: spin;
    animation-duration: 2000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
`;

interface LoaderProps {
  isSpinning: boolean;
}

const Loader = ({ isSpinning }: LoaderProps) => (
  <SSpinner className={isSpinning ? 'spin-me-right-round' : ''}>
    <PolkadotIcon />
  </SSpinner>
);

export default memo(Loader);
