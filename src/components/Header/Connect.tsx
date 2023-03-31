import { BaseWallet } from '@polkadot-onboard/core';
import { memo, useState } from 'react';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

import CrossCloseButton from '@buttons/CrossCloseButton';

import { useAccounts } from '@contexts/AccountsContext';

import { Themeable } from '@helpers/interfaces';
import { SConnectButton } from '@helpers/reusableStyles';
import { SModal } from '@helpers/styledComponents';
import { ellipseAddress, sizeMatters } from '@helpers/utilities';

import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';
import { useOutsideClick } from '@hooks/useOutsideClick';

import DropdownArrow from '@images/dropdown-arrow.svg';

import Wallet from './Wallet';

const SContainer = styled.div`
  position: relative;
`;

const SAccountActions = styled.div<Themeable>`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  padding-bottom: 15px;
  background-color: ${({ activeTheme }) => activeTheme.navigationBackground};
  border-radius: 16px;
  z-index: 1;
  white-space: nowrap;

  &.active {
    display: block;
  }

  > div {
    color: ${({ activeTheme }) => activeTheme.navigationButtonTextColor};
    margin: 20px 10px 0;
  }
`;

const SDividedAction = styled.div<Themeable>`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const SSimpleAction = styled.div<Themeable>`
  :hover {
    cursor: pointer;
    color: ${({ activeTheme }) => activeTheme.navigationButtonActiveTextColor};
  }
`;

const SSecondary = styled.div`
  min-width: 80px;
  text-align: right;
`;

const SCopyButton = styled.span<Themeable>`
  :hover {
    cursor: pointer;
    color: ${({ activeTheme }) => activeTheme.navigationButtonActiveTextColor};
  }
`;

const Connect = () => {
  const { activeAccount, wallets, isAutoConnectDone } = useConnectToStoredAccount();
  const { setActiveAccount, setStoredActiveAccount, theme } = useAccounts();
  const dropdownRef = useOutsideClick(() => setIsAccountActionsVisible(false));
  const [showWalletSelection, setShowWalletSelection] = useState(false);
  const [isAccountActionsVisible, setIsAccountActionsVisible] = useState(false);
  const [copyToClipboard, buttonText] = useCopyToClipboard(activeAccount?.address || '', 'copy', 'copied!');

  const handleClose = () => setShowWalletSelection(false);
  const handleShow = () => {
    if (activeAccount) {
      setIsAccountActionsVisible(!isAccountActionsVisible);
    } else {
      setShowWalletSelection(true);
    }
  };

  const disconnect = () => {
    setActiveAccount(null);
    setStoredActiveAccount(null);
    setIsAccountActionsVisible(false);
  };

  if (!Array.isArray(wallets) || isAutoConnectDone === false) {
    return null;
  }

  return (
    <>
      <SContainer ref={dropdownRef}>
        <SConnectButton
          id='connect'
          className={activeAccount !== null ? 'active' : ''}
          onClick={handleShow}
          activeTheme={theme}
        >
          {activeAccount !== null ? (
            <>
              {sizeMatters(activeAccount.name) || ellipseAddress(activeAccount.address, 4)}
              <DropdownArrow />
            </>
          ) : (
            'Connect Wallet'
          )}
        </SConnectButton>

        <SAccountActions className={isAccountActionsVisible ? 'active' : ''} activeTheme={theme}>
          <SDividedAction activeTheme={theme}>
            {ellipseAddress(activeAccount?.address, 4)}
            <SSecondary>
              <SCopyButton activeTheme={theme} onClick={copyToClipboard}>
                {buttonText}
              </SCopyButton>
            </SSecondary>
          </SDividedAction>
          <SSimpleAction activeTheme={theme} onClick={disconnect}>
            Disconnect wallet
          </SSimpleAction>
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
