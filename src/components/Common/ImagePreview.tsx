import { memo } from 'react';
import styled from 'styled-components';

import IconButton from '@buttons/IconButton';

import { useAccounts } from '@contexts/AccountsContext';

import { ThemeStyle } from '@helpers/interfaces';

import CrossIcon from '@images/icons/cross.svg';

import ShowImage from './ShowImage';

const SImg = styled.img`
  max-width: 100%;
`;

const SClose = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.appliedOverlay};
`;

interface ImagePreviewProps {
  imageCid: string | undefined;
  imageSourceUrl: string | null;
  handleClose: () => void;
}

const ImagePreview = ({ imageCid, imageSourceUrl, handleClose }: ImagePreviewProps) => {
  const { theme } = useAccounts();

  if (!imageSourceUrl && !imageCid) {
    return null;
  }

  if (imageSourceUrl) {
    return (
      <>
        <SImg src={imageSourceUrl} alt='preview' />
        <SClose icon={<CrossIcon />} action={handleClose} activetheme={theme}></SClose>
      </>
    );
  }

  return (
    <>
      <ShowImage imageCid={imageCid} altText='preview' />
      <SClose icon={<CrossIcon />} action={handleClose} activetheme={theme}></SClose>
    </>
  );
};

export default memo(ImagePreview);
