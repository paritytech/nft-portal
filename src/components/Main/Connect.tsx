import { memo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styled from 'styled-components';
import { useWallets } from '@polkadot-onboard/react';
import { BaseWallet } from '@polkadot-onboard/core';

import Wallet from './Wallet';
import { styleSettings } from '../../constants';

const ConnectButton = styled.button`
  color: ${styleSettings.colors.white};
  background-color: ${styleSettings.colors.cerise};
  height: 50px;
  padding: 0 50px;
  border-radius: 10px;
  border: 0;
`;

const Connect = () => {
  const { wallets } = useWallets();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <ConnectButton onClick={handleShow}>
        Connect
      </ConnectButton>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Available wallets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {wallets.map((wallet: BaseWallet, index) => (
            <Wallet key={index} wallet={wallet} />
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default memo(Connect);
