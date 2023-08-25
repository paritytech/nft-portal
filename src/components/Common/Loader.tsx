import { memo } from 'react';
import { styled } from 'styled-components';

import { useModalStatus } from '@contexts/ModalStatusContext.tsx';

import { ModalStatusTypes } from '@helpers/config.ts';

import PolkadotIcon from '@images/icons/polkadot.svg';

const SSpinner = styled.div`
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

const Loader = () => {
  const { status } = useModalStatus();

  if (status === null) {
    return null;
  }

  const spinIt = status.type === ModalStatusTypes.IN_PROGRESS ? 'spin-me-right-round' : '';

  return (
    <SSpinner className={spinIt}>
      <PolkadotIcon />
    </SSpinner>
  );
};

export default memo(Loader);
