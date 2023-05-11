const COLLECTION_ID_PARAM = ':collectionId';
const NFT_ID_PARAM = ':nftId';
const ASSET_ID_PARAM1 = ':assetId1';
const ASSET_ID_PARAM2 = ':assetId2';

export const routes = {
  homepage: '/discover/nfts',

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

    pools: '/my-assets/pools',
    createPool: '/my-assets/pools/create',
  },

  discover: {
    index: '/discover',
    nfts: '/discover/nfts',
    drops: '/discover/drops',
    tokens: '/discover/tokens',
    pools: '/discover/pools',
    addLiquidity: (asset1: string = ASSET_ID_PARAM1, asset2: string = ASSET_ID_PARAM2) =>
      `/discover/pools/add-liquidity/${asset1}/${asset2}`,
  },

  swap: {
    index: '/swap',
    assets: (asset1: string = ASSET_ID_PARAM1, asset2: string = ASSET_ID_PARAM2) => `/swap/${asset1}/${asset2}`,
  },

  capi: {
    index: '/capi',
  },
};
