import { memo } from 'react';
import styled from 'styled-components';

import ShowImage from './ShowImage';

const SImg = styled.img`
  max-width: 100%;
`;

interface ImagePreviewProps {
  imageCid: string | undefined;
  imageSourceUrl: string | null;
}

const ImagePreview = ({ imageCid, imageSourceUrl }: ImagePreviewProps) => {
  if (!imageSourceUrl && !imageCid) {
    return null;
  }

  if (imageSourceUrl) {
    return <SImg src={imageSourceUrl} alt='preview' />;
  }

  return <ShowImage imageCid={imageCid} altText='preview' />;
};

export default memo(ImagePreview);
