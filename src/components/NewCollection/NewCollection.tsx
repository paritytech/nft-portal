import { memo, useCallback } from 'react';

import { useAccounts } from '../../Contexts';

const NewCollection = () => {
  const { api, activeAccount, activeWallet } = useAccounts();

  const createNewCollection = useCallback(async () => {
    if (api && activeAccount && activeWallet) {
      await api.tx.nfts.create(activeAccount.address, null).signAndSend(activeAccount.address, { signer: activeWallet.signer });
    }
  }, [api, activeAccount, activeWallet]);

  return (
    <div>
      <button onClick={() => createNewCollection()}>New collection</button>
    </div>
  );
};

export default memo(NewCollection);
