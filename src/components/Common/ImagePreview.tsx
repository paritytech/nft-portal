import { memo } from 'react';
import { styled } from 'styled-components';

import IconButton from '@buttons/IconButton.tsx';

import TrashIcon from '@images/icons/trash.svg';

import ShowImage from './ShowImage.tsx';

const SImg = styled.img`
  max-width: 100%;
`;

const SClose = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.appliedOverlay};

  &:hover {
    background-color: ${({ theme }) => theme.fill24};
  }

  svg {
    path {
      fill: ${({ theme }) => theme.forcedWhite};
    }
  }
`;

interface ImagePreviewProps {
  imageCid?: string;
  imageSourceUrl?: string;
  handleClose: (event: React.MouseEvent<HTMLElement>) => void;
}

const ImagePreview = ({ imageCid, imageSourceUrl, handleClose }: ImagePreviewProps) => {
  if (!imageSourceUrl && !imageCid) {
    return null;
  }

  if (imageSourceUrl) {
    return (
      <>
        <SImg src={imageSourceUrl} alt='preview' />
        <SClose icon={<TrashIcon />} action={handleClose}></SClose>
      </>
    );
  }

  return (
    <>
      <ShowImage imageCid={imageCid} altText='preview' />
      <SClose icon={<TrashIcon />} action={handleClose}></SClose>
    </>
  );
};

export default memo(ImagePreview);
