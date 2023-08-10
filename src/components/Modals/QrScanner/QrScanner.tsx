import QrScanner from 'qr-scanner';
import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

const VideoWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
`;

const QRVideo = styled.video`
    object-fit: cover;
    border: 1px solid #ddd;
    width: 350px;
    height: 350px;
    border-radius: 50px;
`;

const ScannedText = styled.p`
    word-wrap: break-word;
`;

interface QRScannerProps {
    onScan?: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const [scanned, setScannedText] = useState<string>('');

  useEffect(() => {
    const video = videoElementRef.current;
    const qrScanner = new QrScanner(
      video,
      (result: { data: string }) => {
        console.log('decoded qr code:', result);
        setScannedText(result.data);
        if (onScan) onScan(result.data);
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );
    qrScanner.start();
    console.log('start');

    return () => {
      console.log(qrScanner);
      qrScanner.stop();
      qrScanner.destroy();
    };
  }, [onScan]);

  return (
    <div>
        <VideoWrapper>
            <QRVideo ref={videoElementRef} />
        </VideoWrapper>
        <ScannedText>SCANNED: {scanned}</ScannedText>
    </div>
  );
};

export default QRScanner;
