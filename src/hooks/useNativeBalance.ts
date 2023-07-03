import type { PalletBalancesAccountData } from '@polkadot/types/lookup';
import { BN } from '@polkadot/util';
import { useEffect, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext.tsx';

export const useNativeBalance = () => {
  const { api, activeAccount } = useAccounts();
  const [nativeBalance, setNativeBalance] = useState<BN>();

  useEffect(() => {
    const getNativeBalance = async () => {
      if (api && activeAccount) {
        try {
          const { data: balance } = await api.query.system.account(activeAccount.address);
          setNativeBalance((balance as PalletBalancesAccountData).free.toBn());
        } catch (error) {
          //
        }
      }
    };

    getNativeBalance();
  }, [api, activeAccount]);

  return nativeBalance;
};
