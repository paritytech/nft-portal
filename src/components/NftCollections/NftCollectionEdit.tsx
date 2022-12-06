import { FormEvent, useCallback, useEffect, useRef } from 'react';
import { memo } from 'react';
import { Link, redirect, useParams } from 'react-router-dom';
import { CollectionMetadataData, routes } from '../../constants';

import { useCollectionsMetadata } from '../../hooks';

const NftCollectionEdit = () => {
  const { collectionId } = useParams();
  const { getCollectionMetadata, saveCollectionMetadata, collectionMetadata } = useCollectionsMetadata();
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

  if (!collectionMetadata) {
    return null;
  }

  const { name, description, image } = collectionMetadata;

  return (
    <div>
      <Link to={'..'} relative='path'>
        Back to my collections
      </Link>
      <div>nft collection {collectionId} edit page</div>
      <form onSubmit={submitMetadata}>
        <div>
          <label>
            Collection name: <input type='text' defaultValue={name} ref={collectionNameRef} required />
          </label>
        </div>
        <div>
          <label>
            Description: <input type='text' defaultValue={description} ref={collectionDescriptionRef} />
          </label>
        </div>
        <div>
          <label>
            Image url: <input type='text' defaultValue={image} ref={collectionImageRef} />
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
