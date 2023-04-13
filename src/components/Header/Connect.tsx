import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { Themeable } from '@helpers/interfaces';
import { SConnectButton } from '@helpers/reusableStyles';
import { routes } from '@helpers/routes';
import { ellipseAddress, sizeMatters } from '@helpers/utilities';

import { useConnectToStoredAccount } from '@hooks/useConnectToStoredAccount';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';
import { useOutsideClick } from '@hooks/useOutsideClick';

import ArrowIcon from '@images/icons/arrow.svg';
import CopyIcon from '@images/icons/copy.svg';
import IdenticonIcon from '@images/icons/identicon.svg';
import NftIcon from '@images/icons/nft.svg';
import PlusIcon from '@images/icons/plus.svg';
import PoolIcon from '@images/icons/pool.svg';

import ConnectModal from '@modals/ConnectModal/ConnectModal';

const SContainer = styled.div`
  position: relative;
`;

const SAccountActions = styled.div<Themeable>`
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  padding: 24px;
  background-color: ${({ activeTheme }) => activeTheme.backgroundTertiary};
  border-radius: 16px;
  z-index: 1;
  white-space: nowrap;

  &.active {
    display: block;
  }

  .highlighted {
    color: ${({ activeTheme }) => activeTheme.textAndIconsPrimary};
  }

  a {
    text-decoration: none;
  }
`;

const SSeparator = styled.div<Themeable>`
  border-bottom: 1px solid ${({ activeTheme }) => activeTheme.appliedSeparator};
  margin: 24px 0;
`;

const SActionBlock = styled.div<Themeable>`
  display: flex;
  flex-direction: column;
  gap: 12px;

  a {
    color: ${({ activeTheme }) => activeTheme.textAndIconsPrimary};
  }
`;

const SSimpleAction = styled.div<Themeable>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  span {
    min-width: 190px;
  }

  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const SIcon = styled.div<Themeable>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: ${({ activeTheme }) => activeTheme.fill6};
  border-radius: 20px;

  svg {
    width: 24px;
  }

  &.copied {
    background-color: ${({ activeTheme }) => activeTheme.fill30};
  }
`;

const Connect = () => {
  const { activeAccount, wallets, isAutoConnectDone } = useConnectToStoredAccount();
  const { setActiveAccount, setStoredActiveAccount, theme } = useAccounts();
  const dropdownRef = useOutsideClick(() => setIsAccountActionsVisible(false));
  const [showWalletSelection, setShowWalletSelection] = useState(false);
  const [isAccountActionsVisible, setIsAccountActionsVisible] = useState(false);
  const [copyToClipboard, buttonText] = useCopyToClipboard(activeAccount?.address || '', '', 'copied', 350);

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
              <IdenticonIcon className='identicon' />
              <span>{sizeMatters(activeAccount.name) || ellipseAddress(activeAccount.address, 4)}</span>
              <ArrowIcon className='arrow-down' />
            </>
          ) : (
            'Connect Wallet'
          )}
        </SConnectButton>

        <SAccountActions className={isAccountActionsVisible ? 'active' : ''} activeTheme={theme}>
          {activeAccount !== null && activeAccount.name && (
            <span className='highlighted'>{sizeMatters(activeAccount.name)}</span>
          )}
          <SSimpleAction activeTheme={theme} onClick={copyToClipboard}>
            <span>{ellipseAddress(activeAccount?.address, 4)}</span>
            <SIcon activeTheme={theme} className={buttonText || ''}>
              <CopyIcon />
            </SIcon>
          </SSimpleAction>
          <SSeparator activeTheme={theme} />
          <SActionBlock activeTheme={theme} onClick={() => setIsAccountActionsVisible(false)}>
            <Link to={routes.myAssets.newNftMint}>
              <SSimpleAction activeTheme={theme}>
                <span>Mint NFT</span>
                <SIcon activeTheme={theme}>
                  <PlusIcon />
                </SIcon>
              </SSimpleAction>
            </Link>

            <Link to={routes.myAssets.poolCreate}>
              <SSimpleAction activeTheme={theme}>
                <span>Create Liquidity Pool</span>
                <SIcon activeTheme={theme}>
                  <PoolIcon />
                </SIcon>
              </SSimpleAction>
            </Link>

            <Link to={routes.myAssets.collections}>
              <SSimpleAction activeTheme={theme}>
                <span>My Collections</span>
                <SIcon activeTheme={theme}>
                  <NftIcon />
                </SIcon>
              </SSimpleAction>
            </Link>

            <SSimpleAction activeTheme={theme} onClick={disconnect}>
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
