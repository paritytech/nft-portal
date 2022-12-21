import { useState } from 'react';

export const useStatus = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const clearStatus = () => {
    setStatusMessage(null);
  };

  const nftTaken = (id: string) => {
    setStatusMessage(`NFT with ID ${id} is already taken, try a different ID`);
  };

  return { statusMessage, clearStatus, nftTaken };
};
