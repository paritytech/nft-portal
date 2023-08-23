import { BN } from '@polkadot/util';
import { useCallback, useEffect, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext.tsx';

export const useNativeBalance = () => {
  const { api, activeAccount } = useAccounts();
  const [nativeBalance, setNativeBalance] = useState<BN>();

  const getNativeBalance = useCallback(async () => {
    if (api && activeAccount) {
      try {
        const { data: balance } = await api.query.system.account(activeAccount.address);
        setNativeBalance(balance.free.toBn());
      } catch (error) {
        //
      }
    }
  }, [activeAccount, api]);

  useEffect(() => {
    getNativeBalance();
  }, [getNativeBalance]);

  return { nativeBalance, getNativeBalance };
};
