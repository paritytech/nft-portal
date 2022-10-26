import { Account } from '@polkadot-onboard/core';
import { createContext, useContext, useMemo, useState } from 'react';

interface AccountsContextProviderProps {
  children: any;
}

interface AccountsContextProps {
  activeAccount: Account | null;
  setActiveAccount: (value: Account) => void;
}

const AccountsContext = createContext<AccountsContextProps>({
  activeAccount: { address: '' },
  setActiveAccount: () => {},
});

export const useAccounts = () => useContext(AccountsContext);

export const AccountsContextProvider = ({ children }: AccountsContextProviderProps) => {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  const contextData = useMemo(
    () => ({
      activeAccount,
      setActiveAccount,
    }),
    [activeAccount],
  );

  return <AccountsContext.Provider value={contextData}>{children}</AccountsContext.Provider>;
};
