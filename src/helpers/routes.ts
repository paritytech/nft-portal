const COLLECTION_ID_PARAM = ':collectionId';
const NFT_ID_PARAM = ':collectionId';

export const routes = {
  homepage: '/discover',

  myAssets: {
    index: '/my-assets',
    collections: '/my-assets/collections',
    collectionMint: '/my-assets/collections/mint',
    collectionEdit: (collectionId: string = COLLECTION_ID_PARAM) => `/my-assets/collections/edit/${collectionId}`,
    nfts: (collectionId: string = COLLECTION_ID_PARAM) => `/my-assets/collections/${collectionId}/nfts`,
    nftMint: (collectionId: string = COLLECTION_ID_PARAM) => `/my-assets/collections/${collectionId}/nfts/mint`,
    nftEdit: (collectionId: string = COLLECTION_ID_PARAM, nftId: string = NFT_ID_PARAM) =>
      `/my-assets/collections/${collectionId}/nfts/edit/${nftId}`,
  },

  discover: {
    index: '/discover',
    tokens: '/discover/tokens',
    pools: '/discover/pools',
  },

  swap: {
    index: '/swap',
  },
};
