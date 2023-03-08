import { BaseWallet } from '@polkadot-onboard/core';
import { memo, useState } from 'react';
import Modal from 'react-bootstrap/esm/Modal';

import ActionButton from '@buttons/ActionButton';
import CrossCloseButton from '@buttons/CrossCloseButton';

import { useAccounts } from '@contexts/AccountsContext';

import { SModal } from '@helpers/styledComponents';
import { ellipseAddress, sizeMatters } from '@helpers/utilities';

import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount';

import Wallet from './Wallet';

const Connect = () => {
  const [wallets, activeAccount] = useConnectToStoredAccount();
  const { theme } = useAccounts();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <ActionButton action={handleShow}>
        {activeAccount !== null
          ? sizeMatters(activeAccount.name) || ellipseAddress(activeAccount.address, 4)
          : 'Connect'}
      </ActionButton>

      <SModal show={show} onHide={handleClose} activetheme={theme}>
        <Modal.Header>
          <Modal.Title>Available wallets</Modal.Title>
          <CrossCloseButton variant={theme.closeButtonVariant} handleClose={handleClose} />
        </Modal.Header>
        <Modal.Body>
          {wallets.map((wallet: BaseWallet, index) => (
            <Wallet key={index} wallet={wallet} handleClose={handleClose} />
          ))}
        </Modal.Body>
      </SModal>
    </>
  );
};

export default memo(Connect);
