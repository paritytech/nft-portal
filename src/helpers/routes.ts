const COLLECTION_ID_PARAM = ':collectionId';
const NFT_ID_PARAM = ':nftId';

export const routes = {
  homepage: '/assets-portal',
  collections: '/collections',
  collectionMint: '/collections/mint',
  collectionEdit: (collectionId: string = COLLECTION_ID_PARAM) => `/collections/${collectionId}`,
  nfts: (collectionId: string = COLLECTION_ID_PARAM) => `/collections/${collectionId}/nfts`,
  nftMint: (collectionId: string = COLLECTION_ID_PARAM) => `/collections/${collectionId}/mint`,
  nftEdit: (collectionId: string = COLLECTION_ID_PARAM, nftId: string = NFT_ID_PARAM) =>
    `/collections/${collectionId}/nfts/${nftId}`,
  allAssets: '/all-assets',
  tokens: '/tokens',
  pools: '/pools',
};
