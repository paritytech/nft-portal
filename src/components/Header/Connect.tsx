import { memo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { BaseWallet } from '@polkadot-onboard/core';

import { ellipseAddress, sizeMatters } from '@helpers/utilities';
import ActionButton from '@buttons/ActionButton';
import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount';
import Wallet from './Wallet';

const Connect = () => {
  const [wallets, activeAccount] = useConnectToStoredAccount();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <ActionButton action={handleShow}>
        {activeAccount !== null ? sizeMatters(activeAccount.name) || ellipseAddress(activeAccount.address, 4) : 'Connect'}
      </ActionButton>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Available wallets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {wallets.map((wallet: BaseWallet, index) => (
            <Wallet key={index} wallet={wallet} handleClose={handleClose} />
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default memo(Connect);
