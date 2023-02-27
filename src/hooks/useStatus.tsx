import { useState } from 'react';

import { StatusTypes } from '@helpers/constants';
import { ContextualStatusMessage } from '@helpers/interfaces';

export const useStatus = () => {
  const [contextualStatusMessage, setContextualStatusMessage] = useState<ContextualStatusMessage | null>(null);

  const clearStatus = () => {
    setContextualStatusMessage(null);
  };

  const nftTaken = (id: string) => {
    setContextualStatusMessage({
      statusType: StatusTypes.NFT_TAKEN,
      statusMessage: `NFT with ID ${id} is already taken, try a different ID`,
    });
  };

  const mustBeHolderOf = (collection: string) => {
    setContextualStatusMessage({
      statusType: StatusTypes.MUST_BE_HOLDER_OF,
      statusMessage: `Minting is only available for collection "${collection}" NFT holders`,
    });
  };

  return { contextualStatusMessage, clearStatus, nftTaken, mustBeHolderOf };
};
