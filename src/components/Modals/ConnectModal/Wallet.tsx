import { BaseWallet } from '@polkadot-onboard/core';
import { memo, useEffect } from 'react';

import ArrowButton from '@buttons/ArrowButton';

import { useAccounts } from '@contexts/AccountsContext';

import { useWalletAccounts } from '@hooks/useWalletAccounts';

interface WalletProps {
  wallet: BaseWallet;
  changeStep: () => void;
}

const Wallet = ({ wallet, changeStep }: WalletProps) => {
  const { setActiveWallet, setAvailableAccounts } = useAccounts();
  const { walletAccounts, connectToWallet } = useWalletAccounts(wallet);

  useEffect(() => {
    if (walletAccounts) {
      setActiveWallet(wallet);
      setAvailableAccounts(walletAccounts);
      changeStep();
    }
  }, [walletAccounts, wallet, setActiveWallet, setAvailableAccounts, changeStep]);

  const handleConnection = async () => {
    connectToWallet(wallet);
  };

  return <ArrowButton action={handleConnection}>{wallet.metadata.title}</ArrowButton>;
};

export default memo(Wallet);
