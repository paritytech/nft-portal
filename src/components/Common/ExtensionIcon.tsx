import { memo } from 'react';

import { ExtensionIds } from '@helpers/constants.ts';

import PolkadotjsIcon from '@images/icons/polkadotjs.svg';
import TalismanIcon from '@images/icons/talisman.svg';

interface ExtensionIconProps {
  extensionId: string;
}

const ExtensionIcon = ({ extensionId }: ExtensionIconProps) => {
  const getExtensionIcon = () => {
    switch (extensionId) {
      case ExtensionIds.POLKADOTJS:
        return <PolkadotjsIcon />;
      case ExtensionIds.TALISMAN:
        return <TalismanIcon />;
      default:
        return <PolkadotjsIcon />;
    }
  };

  return <>{getExtensionIcon()}</>;
};

export default memo(ExtensionIcon);
