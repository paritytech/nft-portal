import { memo } from 'react';
import { Link } from 'react-router-dom';

import { NftMetadata, SContentBlock } from '../../constants';

interface NftProps {
  nftMetadata: NftMetadata;
}

const Nft = ({ nftMetadata }: NftProps) => {
  const { id, name, description, image } = nftMetadata;

  return (
    <SContentBlock>
      <div>{id}</div>
      <div>{name}</div>
      <div>{description}</div>
      <div>{image}</div>
      <div>
        <Link to={id}>
          <button>Edit nft metadata</button>
        </Link>
      </div>
    </SContentBlock>
  );
};

export default memo(Nft);
