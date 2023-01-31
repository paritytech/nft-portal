export interface CommonStyleProps {
  activeTheme: ThemeStyle;
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
  theme: ChainThemes;
}

export type ChainTitles = 'localhost' | 'westmint';
export type ChainThemes = 'kusama' | 'polkadot';

export interface ThemeStyle {
  bodyBackground: string;
  buttonTextColor: string;
  buttonBackgroundColor: string;
  defaultTextColor: string;
}
