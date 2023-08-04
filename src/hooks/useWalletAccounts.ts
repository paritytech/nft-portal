import { Account, BaseWallet } from '@polkadot-onboard/core';
import { useCallback, useState } from 'react';

export const useWalletAccounts = () => {
  const [walletAccounts, setWalletAccounts] = useState<Account[] | null>(null);

  const connectToWallet = useCallback(
    async (wallet: BaseWallet) => {
      // if accounts exist, means we are already connected to the wallet
      if (walletAccounts && walletAccounts.length > 0) {
        return;
      }

      try {
        await wallet.connect();
      } catch (error) {
        //
      }

      const accounts = await wallet.getAccounts();
      setWalletAccounts([...accounts]);
    },
    [walletAccounts],
  );

  return { walletAccounts, connectToWallet };
};
