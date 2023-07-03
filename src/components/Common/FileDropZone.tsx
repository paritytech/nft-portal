import { memo, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { styled } from 'styled-components';

import { prefecthCid } from '@helpers/prefetchCid.ts';

import PlusIcon from '@images/icons/plus.svg';

import ImagePreview from './ImagePreview.tsx';

const SDropZone = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  min-height: 300px;
  background-color: ${({ theme }) => theme.fill6};
  border: 1px solid ${({ theme }) => theme.appliedStroke};
  border-radius: 16px;
  outline: none;

  &:hover {
    background-color: ${({ theme }) => theme.fill12};

    img {
      z-index: -1;
    }
  }

  span {
    color: ${({ theme }) => theme.textAndIconsSecondary};
  }

  .positive {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;

    path {
      fill: ${({ theme }) => theme.textAndIconsTertiary};
    }
  }
`;

interface FileDropZoneProps {
  imageSourceUrl?: string;
  setImageSourceUrl: (value?: string) => void;
  imageCid?: string;
  setImageCid: (value?: string) => void;
}

const FileDropZone = ({ imageSourceUrl, setImageSourceUrl, imageCid, setImageCid }: FileDropZoneProps) => {
  const allowedFileTypes = ['.jpg', '.png', '.gif', '.jpeg'];
  const maxSizeInMb = 10;

  const cleanup = useCallback(() => {
    if (imageSourceUrl) {
      URL.revokeObjectURL(imageSourceUrl);
      setImageSourceUrl();
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
    <SDropZone {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />

      <ImagePreview imageCid={imageCid} imageSourceUrl={imageSourceUrl} handleClose={handleClose} />

      {!imageCid && !imageSourceUrl && (
        <>
          <span className='positive'>
            <PlusIcon />
          </span>
          <span>Add media file</span>
        </>
      )}
    </SDropZone>
  );
};

export default memo(FileDropZone);
