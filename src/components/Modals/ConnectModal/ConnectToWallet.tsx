import { BaseWallet } from '@polkadot-onboard/core';
import { memo } from 'react';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

import IconButton from '@buttons/IconButton';

import Title from '@common/Title';

import CrossIcon from '@images/icons/cross.svg';

import Wallet from './Wallet';

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
    <Modal.Header className='border-0'>
      <Modal.Title>
        <STitle className='L'>Connect Wallet</STitle>
      </Modal.Title>
      <IconButton icon={<CrossIcon />} action={handleClose} />
    </Modal.Header>
    <Modal.Body>
      {wallets.map((wallet: BaseWallet) => (
        <Wallet key={wallet.metadata.title} wallet={wallet} changeStep={changeStep} />
      ))}
    </Modal.Body>
  </>
);

export default memo(ConnectToWallet);
