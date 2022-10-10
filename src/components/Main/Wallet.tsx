import { BaseWallet } from '@polkadot-onboard/core';
import { memo } from 'react';

interface WalletProps {
  wallet: BaseWallet;
}

const Wallet = ({ wallet }: WalletProps) => {
  return <div>{wallet.metadata.title}</div>;
};

export default memo(Wallet);
