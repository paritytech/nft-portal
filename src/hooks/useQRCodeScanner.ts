import { RefObject, useState } from 'react';

export const useQRCodeScanner = (inputRef: RefObject<HTMLInputElement>) => {
  const [isQRCodeScannerOpen, setIsQRCodeScannerOpen] = useState(false);

  const handleShow = () => {
    setIsQRCodeScannerOpen(!isQRCodeScannerOpen);
  };

  const handleClose = () => {
    setIsQRCodeScannerOpen(false);
  };

  const handleScan = (address: string) => {
    if (inputRef.current) {
      inputRef.current.value = address;
      setIsQRCodeScannerOpen(false);
    }
  };

  return { isQRCodeScannerOpen, handleShow, handleClose, handleScan };
};
