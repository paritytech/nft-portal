import { BaseWallet } from '@polkadot-onboard/core';
import { memo, useCallback, useState } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

import { ConnectModalSteps } from '@helpers/constants';
import { SModal } from '@helpers/styledComponents';

import ConnectToAccount from './ConnectToAccount';
import ConnectToWallet from './ConnectToWallet';

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
