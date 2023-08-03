import { Account, BaseWallet } from '@polkadot-onboard/core';
import { memo } from 'react';
import { ModalBody } from 'react-bootstrap';
import { styled } from 'styled-components';

import ArrowButton from '@buttons/ArrowButton.tsx';
import IconButton from '@buttons/IconButton.tsx';

import ExtensionIcon from '@common/ExtensionIcon.tsx';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { CssFontRegularM, CssFontSemiBoldM, CssFontSemiBoldXS } from '@helpers/reusableStyles.ts';
import { areEqualAddresses, ellipseAddress } from '@helpers/utilities.ts';

import AccountIcon from '@images/icons/account.svg';
import BackIcon from '@images/icons/back.svg';

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
    ${CssFontSemiBoldXS}
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin: 24px 0;
  gap: 10px;
  color: ${({ theme }) => theme.textAndIconsPrimary};

  button {
    position: absolute;
    top: 0;
    left: 0;
  }

  .wallet-title {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 4px 16px 4px 4px;
    border: 1px solid ${({ theme }) => theme.appliedStroke};
    border-radius: 36px;

    ${CssFontSemiBoldM}

    > svg {
      width: 32px;
      height: 32px;
    }
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
      const foundAccount = availableAccounts.find((account) => areEqualAddresses(account.address, accountAddress));

      if (foundAccount) {
        setActiveAccount(foundAccount);
        setStoredActiveAccount({ wallet: wallet.metadata.title, account: foundAccount.address });
        handleClose();
      }
    }
  };

  return (
    <>
      <ModalBody>
        <SActiveWallet>
          <IconButton icon={<BackIcon />} action={changeStep} />
          <div className='wallet-title'>
            <ExtensionIcon extensionId={wallet.metadata.id} />
            {wallet.metadata.title}
          </div>
        </SActiveWallet>

        <SLabel>Select Account</SLabel>
        {availableAccounts && availableAccounts.length > 0 ? (
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
          <SLabel>No accounts found</SLabel>
        )}
      </ModalBody>
    </>
  );
};

export default memo(ConnectToAccount);
