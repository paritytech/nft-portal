import { BaseWallet } from '@polkadot-onboard/core';
import { memo, useState } from 'react';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

import CrossCloseButton from '@buttons/CrossCloseButton';

import { useAccounts } from '@contexts/AccountsContext';

import { Themeable } from '@helpers/interfaces';
import { SModal } from '@helpers/styledComponents';
import { ellipseAddress, sizeMatters } from '@helpers/utilities';

import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount';

import Wallet from './Wallet';

const SConnectButton = styled.button<Themeable>`
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  background-color: ${({ activeTheme }) => activeTheme.navigationButtonActiveBackgroundColor};
  color: ${({ activeTheme }) => activeTheme.navigationButtonTextColor};
  border: 0;
  border-radius: 32px;
`;

const Connect = () => {
  const { activeAccount, wallets, isConnectionComplete } = useConnectToStoredAccount();
  const { theme } = useAccounts();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (!Array.isArray(wallets) || isConnectionComplete === false) {
    return null;
  }

  return (
    <>
      <SConnectButton onClick={handleShow} activeTheme={theme}>
        {activeAccount !== null
          ? sizeMatters(activeAccount.name) || ellipseAddress(activeAccount.address, 4)
          : 'Connect'}
      </SConnectButton>

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
