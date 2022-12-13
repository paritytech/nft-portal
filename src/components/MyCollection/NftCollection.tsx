import { memo } from 'react';
import { Link } from 'react-router-dom';

import { CollectionMetadata, routes, SContentBlock } from '../../constants';

interface NftCollectionProps {
  collectionMetadata: CollectionMetadata;
}

const NftCollection = ({ collectionMetadata }: NftCollectionProps) => {
  const { id, name, description, image } = collectionMetadata;

  return (
    <SContentBlock>
      <div>{id}</div>
      <div>{name}</div>
      <div>{description}</div>
      <div>{image}</div>
      <div>
        <Link to={id}>
          <button>Edit collection metadata</button>
        </Link>
      </div>
      <div>
        <Link to={routes.ownedNfts(id)}>
          <button>Show owned NFTs</button>
        </Link>
      </div>
      <div>
        <Link to={routes.nftMint(id)}>
          <button>Mint NFT</button>
        </Link>
      </div>
    </SContentBlock>
  );
};

export default memo(NftCollection);
