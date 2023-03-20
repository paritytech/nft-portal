import { memo } from 'react';
import styled from 'styled-components';

import CrossCloseButton from '@buttons/CrossCloseButton';

import { useAccounts } from '@contexts/AccountsContext';

import { ThemeStyle } from '@helpers/interfaces';

import ShowImage from './ShowImage';

const SImg = styled.img`
  max-width: 100%;
`;

const SClose = styled(CrossCloseButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.closeButtonBackgroundColor};
  opacity: 0.6;
`;

interface ImagePreviewProps {
  imageCid: string | undefined;
  imageSourceUrl: string | null;
  handleClose: (event: React.MouseEvent<HTMLElement>) => void;
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
        <SClose handleClose={handleClose} activetheme={theme}></SClose>
      </>
    );
  }

  return (
    <>
      <ShowImage imageCid={imageCid} altText='preview' />
      <SClose handleClose={handleClose} activetheme={theme}></SClose>
    </>
  );
};

export default memo(ImagePreview);
