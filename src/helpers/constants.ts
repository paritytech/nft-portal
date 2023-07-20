export enum ChainTitles {
  LOCALHOST = 'localhost',
  WESTEND_ASSET_HUB = 'westend asset hub',
}

export enum ChainUrls {
  LOCALHOST = 'ws://127.0.0.1:9944',
  WESTEND_ASSET_HUB = 'wss://westend-asset-hub-rpc.polkadot.io',
}

export enum ChainThemes {
  KUSAMA = 'kusama',
  POLKADOT = 'polkadot',
}

export enum RestrictionTypes {
  NFT_TAKEN = 'NFT_TAKEN',
  ALL_NFTS_MINTED = 'ALL_NFTS_MINTED',
  MUST_BE_HOLDER_OF = 'MUST_BE_HOLDER_OF',
}

export enum ModalStatusTypes {
  INIT_TRANSACTION = 'INIT_TRANSACTION',
  IN_PROGRESS = 'IN_PROGRESS',
  ERROR = 'ERROR',
  COMPLETE = 'COMPLETE',
}

export enum StatusMessages {
  ACTION_FAILED = 'Action failed to complete',
  COLLECTION_CREATED = 'Collection created!',
  COLLECTION_CREATING = 'Creating collection, please wait',
  METADATA_UPDATED = 'Metadata updated',
  METADATA_UPDATING = 'Updating metadata, please wait',
  NFT_MINTED = 'NFT minted!',
  NFT_MINTING = 'Minting NFT, please wait',
  TRANSACTION_CANCELED = 'Transaction was canceled',
  TRANSACTION_CONFIRM = 'Please confirm transaction in your wallet',
}

export enum MintTypes {
  ISSUER = 'Issuer',
  PUBLIC = 'Public',
  HOLDER_OF = 'HolderOf',
}

export enum ConnectModalSteps {
  CONNECT_TO_WALLET = 'CONNECT_TO_WALLET',
  CONNECT_TO_ACCOUNT = 'CONNECT_TO_ACCOUNT',
}

export enum ExtensionIds {
  POLKADOTJS = 'polkadot-js',
  TALISMAN = 'talisman',
}
