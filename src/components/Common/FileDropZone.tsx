import { memo, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { Themeable } from '@helpers/interfaces';
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
  border: 1px solid ${({ activeTheme }) => activeTheme.appliedStroke};
  border-radius: 16px;
  outline: none;

  :hover {
    background-color: ${({ activeTheme }) => activeTheme.appliedHover};

    img {
      z-index: -1;
    }
  }

  p {
    margin: 0;
  }
`;

interface FileDropZoneProps {
  imageSourceUrl: string | null;
  setImageSourceUrl: (value: string | null) => void;
  imageCid?: string;
  setImageCid: (value?: string) => void;
}

const FileDropZone = ({ imageSourceUrl, setImageSourceUrl, imageCid, setImageCid }: FileDropZoneProps) => {
  const { theme } = useAccounts();
  const allowedFileTypes = ['.jpg', '.png', '.gif', '.jpeg'];
  const maxSizeInMb = 10;

  const cleanup = useCallback(() => {
    if (imageSourceUrl) {
      URL.revokeObjectURL(imageSourceUrl);
      setImageSourceUrl(null);
    }

    if (imageCid) {
      setImageCid(undefined);
    }
  }, [imageSourceUrl, imageCid, setImageSourceUrl, setImageCid]);

  useEffect(() => () => cleanup(), [cleanup]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        cleanup();

        const { cid, url } = await prefecthCid(acceptedFiles[0]);

        setImageCid(cid);
        setImageSourceUrl(url);
      }
    },
    [setImageCid, setImageSourceUrl, cleanup],
  );

  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      cleanup();
    },
    [cleanup],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': allowedFileTypes },
    maxFiles: 1,
    maxSize: maxSizeInMb * 1024 * 1024,
  });

  return (
    <SDropZone {...getRootProps({ className: 'dropzone' })} activeTheme={theme}>
      <input {...getInputProps()} />

      <ImagePreview imageCid={imageCid} imageSourceUrl={imageSourceUrl} handleClose={handleClose} />

      {!imageCid && !imageSourceUrl && (
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
