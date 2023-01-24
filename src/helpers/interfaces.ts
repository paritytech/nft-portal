export interface CommonStyleProps {
  className?: string;
  isDisabled?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

export interface CollectionMetadata extends CollectionMetadataData {
  id: string;
}

export interface CollectionMetadataData {
  name: string;
  description?: string;
  image?: string;
}

export interface NftMetadata extends NftMetadataData {
  id: string;
}

export interface NftMetadataData {
  name: string;
  description?: string;
  image?: string;
}

export interface ActiveAccount {
  wallet: string;
  account: string;
}

export interface Chain {
  url: string;
  title: ChainTitles;
}

export type ChainTitles = 'localhost' | 'westmint';
