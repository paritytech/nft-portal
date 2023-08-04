import { useWallets } from '@polkadot-onboard/react';
import { useCallback, useEffect, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { areEqualAddresses } from '@helpers/utilities.ts';

export const useConnectToStoredAccount = () => {
  const { wallets } = useWallets();
  const { activeAccount, storedActiveAccount, setActiveAccount, setActiveWallet } = useAccounts();
  const [isAutoConnectDone, setIsAutoConnectDone] = useState(false);

  const connectToStoredAccount = useCallback(async () => {
    if (activeAccount === null && storedActiveAccount !== null && Array.isArray(wallets) && wallets.length > 0) {
      const foundWallet = wallets.find((wallet) => wallet.metadata.title === storedActiveAccount.wallet);

      if (foundWallet) {
        try {
          await foundWallet.connect();
        } catch (error) {
          //
        }

        const accounts = await foundWallet.getAccounts();
        const foundAccount = accounts.find((account) =>
          areEqualAddresses(account.address, storedActiveAccount.account),
        );
        if (foundAccount) {
          setActiveWallet(foundWallet);
          setActiveAccount(foundAccount);
        }
      }
    }

    if (Array.isArray(wallets)) {
      setIsAutoConnectDone(true);
    }
  }, [activeAccount, storedActiveAccount, wallets, setActiveAccount, setActiveWallet]);

  useEffect(() => {
    connectToStoredAccount();
  }, [connectToStoredAccount]);

  return {
    wallets,
    activeAccount,
    isAutoConnectDone,
  };
};
