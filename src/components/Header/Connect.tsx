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
import { useOutsideClick } from '@hooks/useOutsideClick';

import Wallet from './Wallet';

const SContainer = styled.div`
  position: relative;
  height: 40px;
  line-height: 40px;
`;

const SConnectButton = styled.button<Themeable>`
  padding: 0 16px;
  background-color: ${({ activeTheme }) => activeTheme.navigationButtonActiveBackgroundColor};
  color: ${({ activeTheme }) => activeTheme.navigationButtonTextColor};
  border: 0;
  border-radius: 32px;
`;

const SAccountActions = styled.div<Themeable>`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  background-color: ${({ activeTheme }) => activeTheme.navigationBackground};
  border-radius: 16px;
  z-index: 1;

  &.active {
    display: block;
  }
`;

const Connect = () => {
  const { activeAccount, wallets, isAutoConnectDone } = useConnectToStoredAccount();
  const { theme } = useAccounts();
  const dropdownRef = useOutsideClick(() => setIsAccountActionsVisible(false));
  const [showWalletSelection, setShowWalletSelection] = useState(false);
  const [isAccountActionsVisible, setIsAccountActionsVisible] = useState(false);

  const handleClose = () => setShowWalletSelection(false);
  const handleShow = () => {
    if (activeAccount) {
      setIsAccountActionsVisible(true);
    } else {
      setShowWalletSelection(true);
    }
  };

  if (!Array.isArray(wallets) || isAutoConnectDone === false) {
    return null;
  }

  return (
    <>
      <SContainer ref={dropdownRef}>
        <SConnectButton onClick={handleShow} activeTheme={theme}>
          {activeAccount !== null
            ? sizeMatters(activeAccount.name) || ellipseAddress(activeAccount.address, 4)
            : 'Connect'}
        </SConnectButton>

        <SAccountActions className={isAccountActionsVisible ? 'active' : ''} activeTheme={theme}>
          {ellipseAddress(activeAccount!.address, 4)}
          <div>Disconnect wallet</div>
        </SAccountActions>
      </SContainer>

      <SModal show={showWalletSelection} onHide={handleClose} activetheme={theme}>
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
