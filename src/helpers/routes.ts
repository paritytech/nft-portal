const COLLECTION_ID_PARAM = ':collectionId';
const NFT_ID_PARAM = ':nftId';
const ASSET_ID_PARAM1 = ':assetId1';
const ASSET_ID_PARAM2 = ':assetId2';

// TODO rename newNftMint to nftMint later, get rid of old route
export const routes = {
  homepage: '/discover/nfts',

  myAssets: {
    index: '/my-assets',

    newNftMint: '/my-assets/nft-mint',
    selectCollection: '/my-assets/nft-mint/select-collection',

    collections: '/my-assets/collections',
    collectionMint: '/my-assets/collections/mint',
    collectionEdit: (collectionId: string = COLLECTION_ID_PARAM) => `/my-assets/collections/edit/${collectionId}`,
    nfts: (collectionId: string = COLLECTION_ID_PARAM) => `/my-assets/collections/${collectionId}/nfts`,
    nftMint: (collectionId: string = COLLECTION_ID_PARAM) => `/my-assets/collections/${collectionId}/nfts/mint`,
    nftEdit: (collectionId: string = COLLECTION_ID_PARAM, nftId: string = NFT_ID_PARAM) =>
      `/my-assets/collections/${collectionId}/nfts/edit/${nftId}`,

    pools: '/my-assets/pools',
    poolCreate: '/my-assets/pools/create',
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
  },
};
