import { ChangeEvent, memo, useState } from 'react';
import styled from 'styled-components';
import { Account, BaseWallet } from '@polkadot-onboard/core';

import { useAccounts } from '../../Contexts';
import { ActionButton } from '../Common';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../constants';

const SWalletContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const SWalletConnectButton = styled(ActionButton)`
  height: 30px;
  line-height: 30px;
  padding: 0 25px;
`;

interface WalletProps {
  wallet: BaseWallet;
  handleClose: () => void;
}

const Wallet = ({ wallet, handleClose }: WalletProps) => {
  const navigate = useNavigate();
  const { setActiveAccount } = useAccounts();
  const [accounts, setAccounts] = useState<Account[]>([]);

  const connectToWallet = async (wallet: BaseWallet) => {
    // TODO need to check connection status and not allow connecting twice or more to the same wallet
    await wallet.connect();
    const accs = await wallet.getAccounts();

    setAccounts([...accounts, ...accs]);
  };

  const connectToAccount = (event: ChangeEvent<HTMLSelectElement>) => {
    const accountAddress = event.target.value;

    const foundAccount = accounts.find((account) => account.address === accountAddress);

    if (foundAccount) {
      setActiveAccount(foundAccount);
      handleClose();
      navigate(routes.nftCollections);
    }
  };

  return (
    <SWalletContainer>
      <SWalletConnectButton action={() => connectToWallet(wallet)}>{wallet.metadata.title}</SWalletConnectButton>
      {accounts.length > 0 && (
        <select onChange={connectToAccount}>
          <option value=''>
            Select account
          </option>
          {accounts.map((account: Account) => (
            <option key={account.address} value={account.address}>{account.name || account.address}</option>
          ))}
        </select>
      )}
    </SWalletContainer>
  );
};

export default memo(Wallet);
