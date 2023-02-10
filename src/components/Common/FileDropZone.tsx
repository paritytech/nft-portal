import { memo, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import CrossCloseButton from '@buttons/CrossCloseButton';

import { useAccounts } from '@contexts/AccountsContext';

import { ThemeStyle, Themeable } from '@helpers/interfaces';
import { prefecthCid } from '@helpers/prefetchCid';

import ImagePreview from './ImagePreview';

const SDropZone = styled.div<Themeable>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  min-height: 300px;
  border: 4px dashed ${({ activeTheme }) => activeTheme.buttonBorderColor};
  border-radius: 10px;
  outline: none;

  :hover {
    background-color: ${({ activeTheme }) => activeTheme.transparentHoverHighlight};

    img {
      z-index: -1;
    }
  }

  p {
    margin: 0;
  }
`;

const SClose = styled(CrossCloseButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.closeButtonBackgroundColor};
  opacity: 0.6;
`;

interface FileDropZoneProps {
  imageSourceUrl: string | null;
  setImageSourceUrl: (value: string | null) => void;
  setImageCid: (value?: string) => void;
  imageCid?: string;
}

const FileDropZone = ({ imageSourceUrl, setImageSourceUrl, setImageCid, imageCid }: FileDropZoneProps) => {
  const { theme } = useAccounts();
  const allowedFileTypes = ['.jpg', '.png', '.gif', '.jpeg'];
  const maxSizeInMb = 10;

  useEffect(() => {
    if (imageSourceUrl) {
      return () => {
        URL.revokeObjectURL(imageSourceUrl);
        setImageSourceUrl(null);
      };
    }
  }, [imageSourceUrl, setImageSourceUrl]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const { cid, url } = await prefecthCid(acceptedFiles[0]);

        setImageSourceUrl(url);
        setImageCid(cid);
      }
    },
    [setImageSourceUrl, setImageCid],
  );

  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (imageSourceUrl) {
        URL.revokeObjectURL(imageSourceUrl);
        setImageSourceUrl(null);
      }
      setImageCid(undefined);
    },
    [imageSourceUrl, setImageCid, setImageSourceUrl],
  );

  const { getRootProps } = useDropzone({ onDrop, accept: { 'image/*': allowedFileTypes }, maxFiles: 1, maxSize: maxSizeInMb * 1024 * 1024 });

  return (
    <SDropZone {...getRootProps({ className: 'dropzone' })} activeTheme={theme}>
      {imageCid || imageSourceUrl ? (
        <>
          <ImagePreview imageCid={imageCid} imageSourceUrl={imageSourceUrl} />
          <SClose handleClose={handleClose} activetheme={theme}></SClose>
        </>
      ) : (
        <>
          <p>Drag 'n' drop some file here or click to select file</p>
          <p>Allowed files: {allowedFileTypes.map((type) => type).join(' ')}</p>
          <p>Max size: {maxSizeInMb} MB</p>
        </>
      )}
    </SDropZone>
  );
};

export default memo(FileDropZone);
