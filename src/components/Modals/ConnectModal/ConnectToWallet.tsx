import { BaseWallet } from '@polkadot-onboard/core';
import { memo } from 'react';
import { ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import { styled } from 'styled-components';

import IconButton from '@buttons/IconButton.tsx';

import Title from '@common/Title.tsx';

import CrossIcon from '@images/icons/cross.svg';

import Wallet from './Wallet.tsx';

const STitle = styled(Title)`
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
      <ModalTitle>
        <STitle className='L'>Connect Wallet</STitle>
      </ModalTitle>
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
