import { BaseWallet } from '@polkadot-onboard/core';
import { memo, useEffect } from 'react';
import { styled } from 'styled-components';

import ArrowButton from '@buttons/ArrowButton.tsx';

import ExtensionIcon from '@common/ExtensionIcon.tsx';

import { useAccounts } from '@contexts/AccountsContext.tsx';

import { CssFontSemiBoldM } from '@helpers/reusableStyles.ts';

import { useWalletAccounts } from '@hooks/useWalletAccounts.ts';

const SArrowButton = styled(ArrowButton)`
  margin-bottom: 8px;

  :last-child {
    margin-bottom: 0;
  }
`;

const SContent = styled.div`
  ${CssFontSemiBoldM}
  display: flex;
  align-items: center;
  gap: 20px;
  color: ${({ theme }) => theme.textAndIconsPrimary};

  svg {
    width: 32px;
    height: 32px;
  }
`;

interface WalletProps {
  wallet: BaseWallet;
  changeStep: () => void;
}

const Wallet = ({ wallet, changeStep }: WalletProps) => {
  const { setActiveWallet, setAvailableAccounts } = useAccounts();
  const { walletAccounts, connectToWallet } = useWalletAccounts();

  useEffect(() => {
    if (walletAccounts) {
      setActiveWallet(wallet);
      setAvailableAccounts(walletAccounts);
      changeStep();
    }
  }, [walletAccounts, wallet, setActiveWallet, setAvailableAccounts, changeStep]);

  return (
    <SArrowButton action={() => connectToWallet(wallet)}>
      <SContent>
        <ExtensionIcon extensionId={wallet.metadata.id} />
        <span>{wallet.metadata.title}</span>
      </SContent>
    </SArrowButton>
  );
};

export default memo(Wallet);
