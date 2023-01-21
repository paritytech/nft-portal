import { useCallback, useEffect, useState } from 'react';
import { Account, BaseWallet } from '@polkadot-onboard/core';

import { useAccounts } from '@contexts/AccountContext';

export const useWalletAccounts = (wallet: BaseWallet) => {
  const { storedActiveAccount } = useAccounts();
  const [walletAccounts, setWalletAccounts] = useState<Account[]>([]);

  const connectToWallet = useCallback(
    async (wallet: BaseWallet) => {
      // if accounts exist, means we are already connected to the wallet
      // unfortunately isConnected method doesn't work yet, so can't use it
      if (walletAccounts.length > 0) {
        return;
      }

      await wallet.connect();
      const accounts = await wallet.getAccounts();
      setWalletAccounts([...accounts]);
    },
    [walletAccounts],
  );

  useEffect(() => {
    const fetchStoredWalletAccounts = async () => {
      if (storedActiveAccount?.wallet === wallet.metadata.title) {
        connectToWallet(wallet);
      }
    };

    fetchStoredWalletAccounts();
  }, [storedActiveAccount, wallet, connectToWallet]);

  return { walletAccounts, connectToWallet };
};
