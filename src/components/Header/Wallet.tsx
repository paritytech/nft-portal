import { Account, BaseWallet } from '@polkadot-onboard/core';
import { ChangeEvent, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';

import { useAccounts } from '@contexts/AccountContext';

import { routes } from '@helpers/routes';

import { useWalletAccounts } from '@hooks/useWalletAccounts';

const SWalletContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 10px;
`;

const SWalletConnectButton = styled(ActionButton)`
  line-height: 30px;
  padding: 4px 25px;
  width: 200px;
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
  const navigate = useNavigate();
  const { setActiveAccount, setActiveWallet, storedActiveAccount, setStoredActiveAccount } = useAccounts();
  const { walletAccounts, connectToWallet } = useWalletAccounts(wallet);

  const connectToAccount = (event: ChangeEvent<HTMLSelectElement>) => {
    const accountAddress = event.target.value;

    const foundAccount = walletAccounts.find((account) => account.address === accountAddress);

    if (foundAccount) {
      setActiveWallet(wallet);
      setActiveAccount(foundAccount);
      setStoredActiveAccount({ wallet: wallet.metadata.title, account: foundAccount.address });
      handleClose();
      navigate(routes.collections);
    }
  };

  return (
    <SWalletContainer>
      <SWalletConnectButton action={() => connectToWallet(wallet)}>{wallet.metadata.title}</SWalletConnectButton>
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
    </SWalletContainer>
  );
};

export default memo(Wallet);
