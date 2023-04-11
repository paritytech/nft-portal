export enum ChainTitles {
  LOCALHOST = 'localhost',
  WESTMINT = 'westmint',
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
  COLLECTION_MINTED = 'Collection minted!',
  COLLECTION_MINTING = 'Minting collection, please wait',
  METADATA_UPDATED = 'Metadata updated',
  METADATA_UPDATING = 'Updating metadata, please wait',
  NFT_MINTED = 'NFT minted!',
  NFT_MINTING = 'Minting NFT, please wait',
  TRANSACTION_CANCELED = 'Transaction was canceled',
  TRANSACTION_CONFIRM = 'Please confirm transaction in your wallet',
  POOL_CREATION = 'Creating pool, please wait',
  POOL_CREATED = 'Pool created!',
  POOL_INSUFFICIENT_BALANCE_FOR_DEPOSIT = 'Your account`s balance is bellow the required pool creation fee',
  POOL_MIN_LIQUIDITY_ERROR = 'You need to provide at least {amount} for empty pool',
  POOL_ADD_LIQUIDITY_AMOUNT_TOO_HIGH = 'The amount you entered is higher than your balance',
}

export enum MintTypes {
  ISSUER = 'Issuer',
  PUBLIC = 'Public',
  HOLDER_OF = 'HolderOf',
}

export enum MultiAssets {
  NATIVE = 'Native',
  ASSET = 'Asset',
}
