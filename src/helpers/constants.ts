export enum ChainTitles {
  LOCALHOST = 'localhost',
  WESTMINT = 'westmint',
}

export enum ChainThemes {
  KUSAMA = 'kusama',
  POLKADOT = 'polkadot',
}

export enum ChainNativeTokenNames {
  LOCALHOST = 'Unit',
  WESTMINT = 'Westend',
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
  POOL_CREATION = 'Creating pool, please wait',
  POOL_CREATED = 'Pool created!',
  POOL_INSUFFICIENT_BALANCE_FOR_DEPOSIT = 'Your account`s balance is bellow the required pool creation fee',
  POOL_MIN_LIQUIDITY_ERROR = 'You need to provide at least {amount} for empty pool',
  POOL_ADDING_LIQUIDITY = 'Adding liquidity, please wait',
  POOL_AMOUNT_TOO_HIGH = 'The amount you entered is higher than your balance',
  POOL_LIQUIDITY_ADDED = 'Liquidity added!',
  POOL_SWAP_MAX_AMOUNT_ERROR = 'You can`t swap more than {amount}',
  SWAP_EXECUTING = 'Submitting swap details, please wait',
  SWAP_EXECUTED = 'Swap was successfully executed!',
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

export enum ConnectModalSteps {
  CONNECT_TO_WALLET = 'CONNECT_TO_WALLET',
  CONNECT_TO_ACCOUNT = 'CONNECT_TO_ACCOUNT',
}

export enum ExtensionIds {
  POLKADOTJS = 'polkadot-js',
  TALISMAN = 'talisman',
}

export enum SwapTypes {
  EXACT_SEND,
  EXACT_RECEIVE,
}
