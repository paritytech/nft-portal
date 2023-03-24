export const routes = {
  homepage: { index: 'discover' },
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

// absolute routes are used when it is unknown from which page exactly will navigation/redirect happen
// therefore the whole path must be constructed
export const absoluteRoutes = {
  homepage: `/${routes.homepage.index}`,
  collections: `/${routes.myAssets.index}/${routes.myAssets.collections.index}`,
  collectionsEdit: (collectionId: string = ':collectionId') =>
    `/${routes.myAssets.index}/${routes.myAssets.collections.index}/${routes.myAssets.collections.edit(collectionId)}`,
  nfts: (collectionId: string = ':collectionId') =>
    `/${routes.myAssets.index}/${routes.myAssets.collections.index}/${routes.myAssets.collections.nfts.index(
      collectionId,
    )}`,
  nftsEdit: (collectionId: string = ':collectionId', nftId: string = ':nftId') =>
    `/${routes.myAssets.index}/${routes.myAssets.collections.index}/${routes.myAssets.collections.nfts.index(
      collectionId,
    )}/${routes.myAssets.collections.nfts.edit(nftId)}`,
};
