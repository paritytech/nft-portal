import { memo } from 'react';
import Modal from 'react-bootstrap/Modal';

import { useStatusModal } from '@contexts/StatusModalContext';

const StatusModal = () => {
  const { isModalVisible } = useStatusModal();

  return (
    <Modal show={isModalVisible}>
      <Modal.Body>
        <p>Current status will be here</p>
      </Modal.Body>
    </Modal>
  );
};

export default memo(StatusModal);
