import type { BaseWallet } from '@polkadot-onboard/core';
import { memo, useCallback, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { ConnectModalSteps } from '@helpers/constants.ts';
import { SModal } from '@helpers/styledComponents.ts';

import ConnectToAccount from './ConnectToAccount.tsx';
import ConnectToWallet from './ConnectToWallet.tsx';

interface ConnectModalProps {
  showWalletSelection: boolean;
  handleClose: () => void;
  wallets: BaseWallet[];
}

const ConnectModal = ({ showWalletSelection, handleClose, wallets }: ConnectModalProps) => {
  const { activeWallet } = useAccounts();
  const [activeStep, setActiveStep] = useState<ConnectModalSteps>(ConnectModalSteps.CONNECT_TO_WALLET);

  const showStep = useCallback(() => {
    switch (activeStep) {
      case ConnectModalSteps.CONNECT_TO_ACCOUNT:
        if (activeWallet === null) {
          setActiveStep(ConnectModalSteps.CONNECT_TO_WALLET);
          return null;
        }
        return (
          <ConnectToAccount
            handleClose={handleClose}
            wallet={activeWallet}
            changeStep={() => setActiveStep(ConnectModalSteps.CONNECT_TO_WALLET)}
          />
        );
      default:
        return (
          <ConnectToWallet
            handleClose={handleClose}
            wallets={wallets}
            changeStep={() => setActiveStep(ConnectModalSteps.CONNECT_TO_ACCOUNT)}
          />
        );
    }
  }, [activeStep, activeWallet, handleClose, wallets]);

  return (
    <SModal centered show={showWalletSelection} onHide={handleClose}>
      {showStep()}
    </SModal>
  );
};

export default memo(ConnectModal);
