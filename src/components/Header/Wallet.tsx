import { Account, BaseWallet } from '@polkadot-onboard/core';
import { ChangeEvent, memo } from 'react';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';
import ArrowButton from '@buttons/ArrowButton';

import { useAccounts } from '@contexts/AccountsContext';

import { useWalletAccounts } from '@hooks/useWalletAccounts';

const SWalletContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 10px;
`;

// TODO will change with connection process refactoring
const SWalletConnectButton = styled(ActionButton)`
  line-height: 30px;
  padding: 4px 25px;
  min-width: 200px;
`;

const SSelectAccount = styled.select`
  width: 100%;
`;

interface WalletProps {
  wallet: BaseWallet;
  handleClose: () => void;
}

const Wallet = ({ wallet, handleClose }: WalletProps) => {
  const { setActiveAccount, setActiveWallet, storedActiveAccount, setStoredActiveAccount } = useAccounts();
  const { walletAccounts, connectToWallet } = useWalletAccounts(wallet);

  const connectToAccount = (event: ChangeEvent<HTMLSelectElement>) => {
    const accountAddress = event.target.value;

    const foundAccount = walletAccounts.find(
      (account) => account.address.toLocaleLowerCase() === accountAddress.toLocaleLowerCase(),
    );

    if (foundAccount) {
      setActiveWallet(wallet);
      setActiveAccount(foundAccount);
      setStoredActiveAccount({ wallet: wallet.metadata.title, account: foundAccount.address });
      handleClose();
    }
  };

  return (
    <>
      <ArrowButton action={() => connectToWallet(wallet)}>{wallet.metadata.title}</ArrowButton>
      {walletAccounts.length > 0 && (
        <SSelectAccount className='form-select' onChange={connectToAccount} defaultValue={storedActiveAccount?.account}>
          <option value=''>Select account</option>
          {walletAccounts.map((account: Account) => (
            <option key={account.address} value={account.address}>
              {account.name || account.address}
            </option>
          ))}
        </SSelectAccount>
      )}
    </>
  );
};

export default memo(Wallet);
