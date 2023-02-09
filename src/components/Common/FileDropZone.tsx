import { memo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

import { prefecthCid } from '@helpers/prefetchCid';

import ImagePreview from './ImagePreview';

const SDropZone = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  border: 4px dashed #d33079;
  border-radius: 2px;
  outline: none;
`;

const SClose = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
`;

interface FileDropZoneProps {
  imageSourceUrl: string | null;
  setImageSourceUrl: (value: string | null) => void;
  setImageCid: (value?: string) => void;
  imageCid?: string;
}

const FileDropZone = ({ imageSourceUrl, setImageSourceUrl, setImageCid, imageCid }: FileDropZoneProps) => {
  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      if (acceptedFiles) {
        const { cid, url } = await prefecthCid(acceptedFiles[0]);

        setImageSourceUrl(url);
        setImageCid(cid);
      }
    },
    [setImageSourceUrl, setImageCid],
  );

  const handleClose = useCallback(
    (event: any) => {
      event.stopPropagation();
      if (imageSourceUrl) {
        URL.revokeObjectURL(imageSourceUrl);
        setImageSourceUrl(null);
      }
      setImageCid(undefined);
    },
    [imageSourceUrl, setImageCid, setImageSourceUrl],
  );

  const { getRootProps } = useDropzone({ onDrop, accept: { 'image/*': ['.jpg', '.png', '.gif', '.jpeg'] }, maxFiles: 1 });

  return (
    <SDropZone {...getRootProps({ className: 'dropzone' })}>
      {imageCid || imageSourceUrl ? (
        <>
          <ImagePreview imageCid={imageCid} imageSourceUrl={imageSourceUrl} />
          <SClose onClick={handleClose}>X</SClose>
        </>
      ) : (
        <p>Drag 'n' drop some file here, or click to select file</p>
      )}
    </SDropZone>
  );
};

export default memo(FileDropZone);
