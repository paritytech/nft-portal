export const routes = {
  homepage: '/discover',

  myAssets: {
    index: '/my-assets',
    collections: '/my-assets/collections',
    collectionMint: '/my-assets/collections/mint',
    collectionEdit: (collectionId: string = ':collectionId') => `/my-assets/collections/edit/${collectionId}`,
    nfts: (collectionId: string = ':collectionId') => `/my-assets/collections/${collectionId}/nfts`,
    nftMint: (collectionId: string = ':collectionId') => `/my-assets/collections/${collectionId}/nfts/mint`,
    nftEdit: (collectionId: string = ':collectionId', nftId: string = ':nftId') =>
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
