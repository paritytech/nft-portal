import { Account, BaseWallet } from '@polkadot-onboard/core';
import { memo } from 'react';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

import IconButton from '@buttons/IconButton';

import Title from '@common/Title';

import { useAccounts } from '@contexts/AccountsContext';

import { Themeable } from '@helpers/interfaces';

import BackIcon from '@images/icons/back.svg';

const STitle = styled(Title)<Themeable>`
  color: ${({ activeTheme }) => activeTheme.textAndIconsPrimary};
`;

interface ConnectToAccountProps {
  handleClose: () => void;
  wallet: BaseWallet;
  changeStep: () => void;
}

const ConnectToAccount = ({ handleClose, wallet, changeStep }: ConnectToAccountProps) => {
  const { theme } = useAccounts();
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
        <IconButton icon={<BackIcon />} action={changeStep} />
        <Modal.Title>
          <STitle className='L' activeTheme={theme}>
            Connect to Account
          </STitle>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {availableAccounts ? (
          availableAccounts.map((account: Account) => (
            <div key={account.address} onClick={() => connectToAccount(account.address)}>
              {account.name || account.address}
            </div>
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
