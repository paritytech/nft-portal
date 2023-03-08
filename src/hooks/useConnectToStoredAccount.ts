import { Account, BaseWallet } from '@polkadot-onboard/core';
import { useWallets } from '@polkadot-onboard/react';
import { useEffect } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

export const useConnectToStoredAccount = () => {
  const { wallets } = useWallets();

  const { activeAccount, storedActiveAccount, setActiveAccount, setActiveWallet } = useAccounts();

  useEffect(() => {
    const autoConnectToStoredAccount = async () => {
      if (storedActiveAccount !== null && wallets.length > 0) {
        const foundWallet = wallets.find((wallet) => wallet.metadata.title === storedActiveAccount.wallet);

        if (foundWallet) {
          await foundWallet.connect();
          const accounts = await foundWallet.getAccounts();
          const foundAccount = accounts.find((account) => account.address === storedActiveAccount.account);
          if (foundAccount) {
            setActiveWallet(foundWallet);
            setActiveAccount(foundAccount);
          }
        }
      }
    };

    autoConnectToStoredAccount();
  }, [wallets, storedActiveAccount, setActiveAccount, setActiveWallet]);

  return [wallets, activeAccount] as [BaseWallet[], Account | null];
};
