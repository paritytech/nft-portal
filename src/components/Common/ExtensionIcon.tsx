import { memo } from 'react';

import { ExtensionIds } from '@helpers/config.ts';

import PolkadotjsIcon from '@images/icons/polkadotjs.svg';
import SubWalletIcon from '@images/icons/sub-wallet.svg';
import TalismanIcon from '@images/icons/talisman.svg';
import WalletConnectIcon from '@images/icons/wallet-connect.svg';

interface ExtensionIconProps {
  extensionId: string;
}

const ExtensionIcon = ({ extensionId }: ExtensionIconProps) => {
  const getExtensionIcon = () => {
    switch (extensionId) {
      case ExtensionIds.POLKADOTJS:
        return <PolkadotjsIcon />;
      case ExtensionIds.SUB_WALLET:
        return <SubWalletIcon />;
      case ExtensionIds.TALISMAN:
        return <TalismanIcon />;
      case ExtensionIds.WALLET_CONNECT:
        return <WalletConnectIcon />;
      default:
        return <PolkadotjsIcon />;
    }
  };

  return <>{getExtensionIcon()}</>;
};

export default memo(ExtensionIcon);
