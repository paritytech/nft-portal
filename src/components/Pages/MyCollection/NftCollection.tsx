import { memo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { CollectionMetadata } from '@helpers/interfaces';
import { routes } from '@helpers/routes';
import { SContentBlock, SActionButtonMini } from '@helpers/styles';
import ShowImage from '@common/ShowImage';

interface NftCollectionProps {
  collectionMetadata: CollectionMetadata;
}

const NftCollection = ({ collectionMetadata }: NftCollectionProps) => {
  const { id, name, description, image } = collectionMetadata;
  const navigate = useNavigate();

  return (
    <SContentBlock>
      <div>
        <label>Collection ID: #</label>
        {id}
      </div>
      <div>
        <label>Name:</label>
        {name}
      </div>
      <div>
        <label>Description:</label>
        {description}
      </div>
      <ShowImage image={image} altText={description} />
      <div>
        <SActionButtonMini action={() => navigate(routes.nftCollectionEdit(id))}>Edit metadata</SActionButtonMini>
      </div>
      <div>
        <SActionButtonMini action={() => navigate(routes.ownedNfts(id))}>Show owned NFTs</SActionButtonMini>
      </div>
      <div>
        <SActionButtonMini action={() => navigate(routes.nftMint(id))}>Mint NFT</SActionButtonMini>
      </div>
    </SContentBlock>
  );
};

export default memo(NftCollection);
