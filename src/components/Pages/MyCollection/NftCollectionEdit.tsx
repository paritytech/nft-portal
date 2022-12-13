import { FormEvent, memo, useCallback, useEffect, useRef } from 'react';
import { Link, redirect, useParams } from 'react-router-dom';

import { CollectionMetadataData } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { useCollections } from '@hooks/useCollections';

const NftCollectionEdit = () => {
  const { collectionId } = useParams();
  const { getCollectionMetadata, saveCollectionMetadata, collectionMetadata, isCollectionDataLoading } = useCollections();
  const collectionNameRef = useRef<HTMLInputElement>(null);
  const collectionDescriptionRef = useRef<HTMLInputElement>(null);
  const collectionImageRef = useRef<HTMLInputElement>(null);

  const submitMetadata = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (collectionId && collectionNameRef.current) {
        const updatedMetadata: CollectionMetadataData = {
          name: collectionNameRef.current.value,
          description: collectionDescriptionRef.current ? collectionDescriptionRef.current.value : undefined,
          image: collectionImageRef.current ? collectionImageRef.current.value : undefined,
        };

        saveCollectionMetadata(collectionId, updatedMetadata);
      }
    },
    [collectionId, saveCollectionMetadata],
  );

  useEffect(() => {
    if (collectionId) {
      getCollectionMetadata(collectionId);
    }
  }, [collectionId, getCollectionMetadata]);

  if (!collectionId) {
    redirect(routes.nftCollections);
    return null;
  }

  if (isCollectionDataLoading) {
    return <>loading...</>;
  }

  return (
    <div>
      <Link to={'..'} relative='path'>
        Back to my collections
      </Link>
      <div>nft collection {collectionId} edit page</div>

      <form onSubmit={submitMetadata}>
        <div>
          <label>
            Collection name: <input type='text' defaultValue={collectionMetadata?.name} ref={collectionNameRef} required />
          </label>
        </div>
        <div>
          <label>
            Description: <input type='text' defaultValue={collectionMetadata?.description} ref={collectionDescriptionRef} />
          </label>
        </div>
        <div>
          <label>
            Image ipfs hash: <input type='text' defaultValue={collectionMetadata?.image} ref={collectionImageRef} />
          </label>
        </div>
        <div>
          <input type='submit' value='Submit metadata' />
        </div>
      </form>
    </div>
  );
};

export default memo(NftCollectionEdit);
