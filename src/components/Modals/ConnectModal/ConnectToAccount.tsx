import { Account, BaseWallet } from '@polkadot-onboard/core';
import { memo } from 'react';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

import ArrowButton from '@buttons/ArrowButton';
import IconButton from '@buttons/IconButton';

import ExtensionIcon from '@common/ExtensionIcon';
import Title from '@common/Title';

import { useAccounts } from '@contexts/AccountsContext';

import { CssFontRegularM, CssFontRegularS } from '@helpers/reusableStyles';
import { ellipseAddress } from '@helpers/utilities';

import AccountIcon from '@images/icons/account.svg';
import BackIcon from '@images/icons/back.svg';

const STitle = styled(Title)`
  color: ${({ theme }) => theme.textAndIconsPrimary};
`;

const SArrowButton = styled(ArrowButton)`
  margin-bottom: 8px;

  :last-child {
    margin-bottom: 0;
  }
`;

const SContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: ${({ theme }) => theme.textAndIconsPrimary};

  svg {
    width: 32px;
    height: 32px;
  }
`;

const SAccount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  .account-name {
    ${CssFontRegularS}
    color: ${({ theme }) => theme.textAndIconsSecondary};
  }

  .account-address {
    ${CssFontRegularM}
  }
`;

const SLabel = styled.div`
  margin: 16px 0;
`;

const SActiveWallet = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding-left: 12px;
  color: ${({ theme }) => theme.textAndIconsPrimary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.appliedStroke};

  > svg {
    width: 32px;
    height: 32px;
  }
`;

interface ConnectToAccountProps {
  handleClose: () => void;
  wallet: BaseWallet;
  changeStep: () => void;
}

const ConnectToAccount = ({ handleClose, wallet, changeStep }: ConnectToAccountProps) => {
  const { setActiveAccount, setStoredActiveAccount, availableAccounts } = useAccounts();

  const connectToAccount = (accountAddress: string) => {
    if (availableAccounts) {
      const foundAccount = availableAccounts.find(
        (account) => account.address.toLocaleLowerCase() === accountAddress.toLocaleLowerCase(),
      );

      if (foundAccount) {
        setActiveAccount(foundAccount);
        setStoredActiveAccount({ wallet: wallet.metadata.title, account: foundAccount.address });
        handleClose();
      }
    }
  };

  return (
    <>
      <Modal.Header className='border-0'>
        <Modal.Title>
          <STitle className='L'>Connect to Account</STitle>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SActiveWallet>
          <IconButton icon={<BackIcon />} action={changeStep} />
          <ExtensionIcon extensionId={wallet.metadata.id} />
          {wallet.metadata.title}
        </SActiveWallet>
        <SLabel>Select Account</SLabel>
        {availableAccounts ? (
          availableAccounts.map((account: Account) => (
            <SArrowButton key={account.address} action={() => connectToAccount(account.address)}>
              <SContent>
                <AccountIcon />
                <SAccount>
                  {account.name && <div className='account-name'>{account.name}</div>}
                  <div className='account-address'>{ellipseAddress(account.address, 6)}</div>
                </SAccount>
              </SContent>
            </SArrowButton>
          ))
        ) : (
          // TODO change this
          <>no accounts found</>
        )}
      </Modal.Body>
    </>
  );
};

export default memo(ConnectToAccount);
