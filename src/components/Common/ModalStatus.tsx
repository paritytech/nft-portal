import { memo, useEffect } from 'react';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';

import { useModalStatus } from '@contexts/ModalStatusContext';

import { ModalStatusTypes } from '@helpers/constants';
import { SModal } from '@helpers/styledComponents';

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
    <SModal centered show={isModalVisible}>
      <Modal.Header className='border-0'></Modal.Header>
      <Modal.Body className='text-center'>
        <Loader />
        <SStatusMessage>{status.message}</SStatusMessage>
        {showButton && (
          <ActionButton action={concludeModalStatus} className='main S padding32'>
            OK
          </ActionButton>
        )}
      </Modal.Body>
    </SModal>
  );
};

export default memo(ModalStatus);
