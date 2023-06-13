import { BaseWallet } from '@polkadot-onboard/core';
import { memo } from 'react';
import { ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import { styled } from 'styled-components';

import IconButton from '@buttons/IconButton.tsx';

import { CssFontSemiBoldL } from '@helpers/reusableStyles.ts';

import CrossIcon from '@images/icons/cross.svg';

import Wallet from './Wallet.tsx';

const SModalTitle = styled(ModalTitle)`
  ${CssFontSemiBoldL}
  color: ${({ theme }) => theme.textAndIconsPrimary};
`;

interface ConnectToWalletProps {
  handleClose: () => void;
  wallets: BaseWallet[];
  changeStep: () => void;
}

const ConnectToWallet = ({ handleClose, wallets, changeStep }: ConnectToWalletProps) => (
  <>
    <ModalHeader className='border-0'>
      <SModalTitle>Connect Wallet</SModalTitle>
      <IconButton icon={<CrossIcon />} action={handleClose} />
    </ModalHeader>
    <ModalBody>
      {wallets.map((wallet: BaseWallet) => (
        <Wallet key={wallet.metadata.title} wallet={wallet} changeStep={changeStep} />
      ))}
    </ModalBody>
  </>
);

export default memo(ConnectToWallet);
