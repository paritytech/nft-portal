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
  TRANSACTION_CANCELED = 'Transaction was canceled',
  TRANSACTION_CONFIRM = 'Please confirm transaction in your wallet',
}
