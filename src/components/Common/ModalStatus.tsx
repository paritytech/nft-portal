import { memo, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';

import { useAccounts } from '@contexts/AccountsContext';
import { useModalStatus } from '@contexts/ModalStatusContext';

import { ModalStatusTypes } from '@helpers/constants';
import { ThemeStyle } from '@helpers/interfaces';

import Loader from './Loader';

const SModal = styled(Modal)`
  .modal-content {
    background-color: ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.bodyBackground};
    border: 2px solid ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.buttonBorderColor};
    color: ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.defaultTextColor};
  }
`;

const SStatusMessage = styled.p`
  font-size: 24px;
`;

const ModalStatus = () => {
  const { theme } = useAccounts();
  const { isModalVisible, status, resetModalStatus, concludeModalStatus } = useModalStatus();

  useEffect(() => {
    return resetModalStatus();
  }, [resetModalStatus]);

  if (status === null) {
    return null;
  }

  const showButton = status.type === ModalStatusTypes.COMPLETE || status.type === ModalStatusTypes.ERROR;

  return (
    <SModal centered show={isModalVisible} activetheme={theme}>
      <Modal.Body className='text-center'>
        <Loader />
        <SStatusMessage>{status.message}</SStatusMessage>
        {showButton && <ActionButton action={concludeModalStatus}>OK</ActionButton>}
      </Modal.Body>
    </SModal>
  );
};

export default memo(ModalStatus);
