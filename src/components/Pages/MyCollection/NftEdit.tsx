import { FormEvent, memo, useCallback, useEffect, useRef } from 'react';
import { Link, redirect, useParams } from 'react-router-dom';

import { CollectionMetadataData } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { useNfts } from '@hooks/useNfts';

const NftEdit = () => {
  const { collectionId, nftId } = useParams();
  const { getNftMetadata, saveNftMetadata, nftMetadata, isNftDataLoading } = useNfts(collectionId || '');
  const nftNameRef = useRef<HTMLInputElement>(null);
  const nftDescriptionRef = useRef<HTMLInputElement>(null);
  const nftImageRef = useRef<HTMLInputElement>(null);

  const submitMetadata = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (collectionId && nftId && nftNameRef.current) {
        const updatedMetadata: CollectionMetadataData = {
          name: nftNameRef.current.value,
          description: nftDescriptionRef.current ? nftDescriptionRef.current.value : undefined,
          image: nftImageRef.current ? nftImageRef.current.value : undefined,
        };

        saveNftMetadata(nftId, updatedMetadata);
      }
    },
    [collectionId, nftId, saveNftMetadata],
  );

  useEffect(() => {
    if (collectionId && nftId) {
      getNftMetadata(nftId);
    }
  }, [collectionId, nftId, getNftMetadata]);

  if (!collectionId || !nftId) {
    redirect(routes.nftCollections);
    return null;
  }

  if (isNftDataLoading) {
    return <>loading...</>;
  }

  return (
    <div>
      <Link to={'..'} relative='path'>
        Back
      </Link>
      <div>NFT ID:{nftId} metadata edit</div>
      <form onSubmit={submitMetadata}>
        <div>
          <label>
            NFT name: <input type='text' defaultValue={nftMetadata?.name} ref={nftNameRef} required />
          </label>
        </div>
        <div>
          <label>
            Description: <input type='text' defaultValue={nftMetadata?.description} ref={nftDescriptionRef} />
          </label>
        </div>
        <div>
          <label>
            Image ipfs hash: <input type='text' defaultValue={nftMetadata?.image} ref={nftImageRef} />
          </label>
        </div>
        <div>
          <input type='submit' value='Submit metadata' />
        </div>
      </form>
    </div>
  );
};

export default memo(NftEdit);
