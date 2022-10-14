import { memo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useWallets } from '@polkadot-onboard/react';
import { BaseWallet } from '@polkadot-onboard/core';

import Wallet from './Wallet';
import { useAccounts } from '../../Contexts';
import { ellipseAddress, sizeMatters } from '../../helpers';
import { ActionButton } from '../Common';

const Connect = () => {
  const { wallets } = useWallets();
  const { activeAccount } = useAccounts();
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
