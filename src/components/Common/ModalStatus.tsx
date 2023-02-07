import { memo, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';

import { useModalStatus } from '@contexts/ModalStatusContext';

import { ModalStatusTypes } from '@helpers/constants';

import Loader from './Loader';

const SStatusMessage = styled.p`
  font-size: 24px;
`;

const ModalStatus = () => {
  const { isModalVisible, status, resetModalStatus, concludeModalStatus } = useModalStatus();

  useEffect(() => {
    return resetModalStatus();
  }, [resetModalStatus]);

  if (status === null) {
    return null;
  }

  const showButton = status.type === ModalStatusTypes.COMPLETE || status.type === ModalStatusTypes.ERROR;

  return (
    <Modal centered show={isModalVisible}>
      <Modal.Body className='text-center'>
        <Loader />
        <SStatusMessage>{status.message}</SStatusMessage>
        {showButton && <ActionButton action={concludeModalStatus}>OK</ActionButton>}
      </Modal.Body>
    </Modal>
  );
};

export default memo(ModalStatus);
