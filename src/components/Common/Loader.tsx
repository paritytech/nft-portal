import { memo } from 'react';
import styled from 'styled-components';

import PolkadotIcon from '@assets/polkadot-icon.svg';

import { useModalStatus } from '@contexts/ModalStatusContext';

import { ModalStatusTypes } from '@helpers/constants';

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
