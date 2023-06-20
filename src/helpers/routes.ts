const COLLECTION_ID_PARAM = ':collectionId';
const NFT_ID_PARAM = ':nftId';

export const routes = {
  homepage: '/',

  myAssets: {
    index: '/my-assets',

    mintNftMain: '/my-assets/mint-nft',
    createCollection: '/my-assets/mint-nft/create-collection',
    mintNft: (collectionId: string = COLLECTION_ID_PARAM) => `/my-assets/mint-nft/${collectionId}/mint`,

    collections: '/my-assets/collections',
    collectionEdit: (collectionId: string = COLLECTION_ID_PARAM) => `/my-assets/collections/edit/${collectionId}`,
    nfts: (collectionId: string = COLLECTION_ID_PARAM) => `/my-assets/collections/${collectionId}/nfts`,
    nftEdit: (collectionId: string = COLLECTION_ID_PARAM, nftId: string = NFT_ID_PARAM) =>
      `/my-assets/collections/${collectionId}/nfts/edit/${nftId}`,
  },
};
