const COLLECTION_ID_PARAM = ':collectionId';
const NFT_ID_PARAM = ':nftId';

export const routes = {
  homepage: '/assets-portal',
  nftCollections: '/nft-collections',
  nftCollectionEdit: (collectionId: string = COLLECTION_ID_PARAM) => `/nft-collections/${collectionId}`,
  newCollection: '/new-collection',
  ownedNfts: (collectionId: string = COLLECTION_ID_PARAM) => `/nft-collections/${collectionId}/nfts`,
  nftMint: (collectionId: string = COLLECTION_ID_PARAM) => `/nft-collections/${collectionId}/mint`,
  nftEdit: (collectionId: string = COLLECTION_ID_PARAM, nftId: string = NFT_ID_PARAM) => `/nft-collections/${collectionId}/nfts/${nftId}`,
};
