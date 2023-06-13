import { truncate } from 'lodash';
import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { SConnectButton } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';
import { ellipseAddress } from '@helpers/utilities.ts';

import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount.ts';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard.ts';
import { useOutsideClick } from '@hooks/useOutsideClick.ts';

import CopyIcon from '@images/icons/copy.svg';
import IdenticonIcon from '@images/icons/identicon.svg';
import NftIcon from '@images/icons/nft.svg';
import PlusIcon from '@images/icons/plus.svg';
import PoolIcon from '@images/icons/pool.svg';

import ConnectModal from '@modals/ConnectModal/ConnectModal.tsx';

const SContainer = styled.div`
  position: relative;
`;

const SAccountActions = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  padding: 24px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
  border-radius: 16px;
  z-index: 1;
  white-space: nowrap;

  &.active {
    display: block;
  }

  .highlighted {
    color: ${({ theme }) => theme.textAndIconsPrimary};
  }

  a {
    text-decoration: none;
  }
`;

const SSeparator = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.appliedSeparator};
  margin: 24px 0;
`;

const SActionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  a {
    color: ${({ theme }) => theme.textAndIconsPrimary};
  }
`;

const SSimpleAction = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  span {
    min-width: 190px;
  }

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const SIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.fill6};
  border-radius: 20px;

  svg {
    width: 24px;
  }

  &.copied {
    background-color: ${({ theme }) => theme.fill30};
  }
`;

const Connect = () => {
  const { activeAccount, wallets, isAutoConnectDone } = useConnectToStoredAccount();
  const { setActiveAccount, setStoredActiveAccount } = useAccounts();
  const dropdownRef = useOutsideClick(() => setIsAccountActionsVisible(false));
  const [showWalletSelection, setShowWalletSelection] = useState(false);
  const [isAccountActionsVisible, setIsAccountActionsVisible] = useState(false);
  const [copyToClipboard, buttonText] = useCopyToClipboard(activeAccount?.address || '', '', 'copied', 350);

  useEffect(() => {
    const connect = document.getElementById('connect');

    if (connect !== null) {
      if (isAccountActionsVisible) {
        connect.classList.add('actions-active');
      } else {
        connect.classList.remove('actions-active');
      }
    }
  }, [isAccountActionsVisible]);

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
        <SConnectButton id='connect' className={activeAccount !== null ? 'active' : ''} onClick={handleShow}>
          {activeAccount !== null ? (
            <>
              <IdenticonIcon className='identicon' />
              <span>{truncate(activeAccount.name, { length: 16 }) || ellipseAddress(activeAccount.address)}</span>
            </>
          ) : (
            'Connect Wallet'
          )}
        </SConnectButton>

        <SAccountActions className={isAccountActionsVisible ? 'active' : ''}>
          {activeAccount !== null && activeAccount.name && (
            <span className='highlighted'>{truncate(activeAccount.name, { length: 16 })}</span>
          )}
          <SSimpleAction onClick={copyToClipboard}>
            <span>{ellipseAddress(activeAccount?.address, 4)}</span>
            <SIcon className={buttonText || ''}>
              <CopyIcon />
            </SIcon>
          </SSimpleAction>
          <SSeparator />
          <SActionBlock onClick={() => setIsAccountActionsVisible(false)}>
            <Link to={routes.myAssets.mintNftMain}>
              <SSimpleAction>
                <span>Mint NFT</span>
                <SIcon>
                  <PlusIcon />
                </SIcon>
              </SSimpleAction>
            </Link>

            <Link to={routes.myAssets.createPool}>
              <SSimpleAction>
                <span>Create Liquidity Pool</span>
                <SIcon>
                  <PoolIcon />
                </SIcon>
              </SSimpleAction>
            </Link>

            <Link to={routes.myAssets.collections}>
              <SSimpleAction>
                <span>My Collections</span>
                <SIcon>
                  <NftIcon />
                </SIcon>
              </SSimpleAction>
            </Link>

            <SSimpleAction onClick={disconnect}>
              <span>Disconnect wallet</span>
            </SSimpleAction>
          </SActionBlock>
        </SAccountActions>
      </SContainer>

      <ConnectModal showWalletSelection={showWalletSelection} handleClose={handleClose} wallets={wallets} />
    </>
  );
};

export default memo(Connect);
