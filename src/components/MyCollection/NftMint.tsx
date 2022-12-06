import { FormEvent, useCallback, useRef, memo } from 'react';
import { useParams } from 'react-router-dom';

import { useNfts } from '../../hooks';

const NftMint = () => {
  const { collectionId } = useParams();
  const { mintNft } = useNfts(collectionId || '');
  const nftIdRef = useRef<HTMLInputElement>(null);

  const submitMintNft = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (collectionId && nftIdRef.current) {
        mintNft(nftIdRef.current.value);
      }
    },
    [collectionId, mintNft],
  );

  return (
    <div>
      <form onSubmit={submitMintNft}>
        <div>
          <label>
            Collection ID: <input type='text' defaultValue={collectionId} readOnly />
          </label>
        </div>
        <div>
          <label>
            NFT ID: <input type='text' ref={nftIdRef} required />
          </label>
        </div>
        <div>
          <input type='submit' value='Mint NFT' />
        </div>
      </form>
    </div>
  );
};

export default memo(NftMint);
