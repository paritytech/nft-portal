import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAccounts } from '@contexts/AccountContext';
import { routes } from '@helpers/routes';
import { normalizePath } from '@helpers/utilities';
import { useWallets } from '@polkadot-onboard/react';
import { Account, BaseWallet } from '@polkadot-onboard/core';

export const useConnectToStoredAccount = () => {
  const { wallets } = useWallets();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeAccount, storedActiveAccount, setActiveAccount, setActiveWallet } = useAccounts();

  useEffect(() => {
    const autoConnectToStoredAccount = async () => {
      if (location.pathname === normalizePath(routes.homepage) && storedActiveAccount !== null && wallets.length > 0) {
        const foundWallet = wallets.find((wallet) => wallet.metadata.title === storedActiveAccount.wallet);

        if (foundWallet) {
          await foundWallet.connect();
          const accounts = await foundWallet.getAccounts();
          const foundAccount = accounts.find((account) => account.address === storedActiveAccount.account);
          if (foundAccount) {
            setActiveWallet(foundWallet);
            setActiveAccount(foundAccount);
            navigate(routes.collections);
          }
        }
      }
    };

    autoConnectToStoredAccount();
  }, [wallets, storedActiveAccount, location, navigate, setActiveAccount, setActiveWallet]);

  return [wallets, activeAccount] as [BaseWallet[], Account | null];
};
