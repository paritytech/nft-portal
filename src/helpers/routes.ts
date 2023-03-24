export const routes = {
  homepage: 'discover',
  myAssets: {
    index: 'my-assets',
    collections: {
      index: 'collections',
      mint: 'mint',
      edit: (collectionId: string = ':collectionId') => `edit/${collectionId}`,
      nfts: {
        index: (collectionId: string = ':collectionId') => `${collectionId}/nfts`,
        mint: `mint`,
        edit: (nftId: string = ':nftId') => `edit/${nftId}`,
      },
    },
  },
  discover: {
    index: 'discover',
    tokens: 'tokens',
    pools: 'pools',
  },
  swap: {
    index: 'swap',
  },
};
