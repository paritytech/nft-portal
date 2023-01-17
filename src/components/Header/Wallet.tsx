import { ChangeEvent, memo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Account, BaseWallet } from '@polkadot-onboard/core';

import { useAccounts } from '@contexts/AccountContext';
import ActionButton from '@buttons/ActionButton';
import { routes } from '@helpers/routes';

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
  const { setActiveAccount, setActiveWallet } = useAccounts();
  const [accounts, setAccounts] = useState<Account[]>([]);

  const connectToWallet = async (wallet: BaseWallet) => {
    // if accounts exist, means we are already connected to the wallet
    // unfortunately isConnected method doesn't work yet, so can't use it
    if (accounts.length > 0) {
      return;
    }

    await wallet.connect();
    const accs = await wallet.getAccounts();

    setAccounts([...accounts, ...accs]);
  };

  const connectToAccount = (event: ChangeEvent<HTMLSelectElement>) => {
    const accountAddress = event.target.value;

    const foundAccount = accounts.find((account) => account.address === accountAddress);

    if (foundAccount) {
      setActiveWallet(wallet);
      setActiveAccount(foundAccount);
      handleClose();
      navigate(routes.collections);
    }
  };

  return (
    <SWalletContainer>
      <SWalletConnectButton action={() => connectToWallet(wallet)}>{wallet.metadata.title}</SWalletConnectButton>
      {accounts.length > 0 && (
        <SSelectAccount className='form-select' onChange={connectToAccount}>
          <option value=''>Select account</option>
          {accounts.map((account: Account) => (
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
