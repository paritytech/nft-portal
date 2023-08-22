import QrScanner from 'qr-scanner';
import { memo, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { styled } from 'styled-components';

const QRModal = styled(Modal)`
  .modal-dialog,
  .modal-content {
    width: 350px;
    height: 350px;
  }

  .modal-content {
    border-radius: 50px;
  }
`;

const QRVideo = styled.video`
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 50px;
`;

interface QRScannerModalProps {
  onScan: (address: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const QRScannerModal = ({ onScan, isOpen, onClose }: QRScannerModalProps) => {
  const videoElementRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoElementRef.current;

    if (video !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qrScanner = new (QrScanner as any)(
        video,
        (result: { data: string }) => {
          onScan(result.data);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
        },
      );

      qrScanner.start().catch(() => {
        onClose();
      });

      return () => {
        qrScanner.stop();
        qrScanner.destroy();
      };
    }
  }, [onClose, onScan]);

  return (
    <QRModal centered show={isOpen} onHide={onClose}>
      <QRVideo ref={videoElementRef} />
    </QRModal>
  );
};

export default memo(QRScannerModal);
