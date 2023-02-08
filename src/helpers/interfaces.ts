import { ModalStatusTypes, StatusMessages } from './constants';

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
  theme: ChainThemes;
}

export type ChainTitles = 'localhost' | 'westmint';
export type ChainThemes = 'kusama' | 'polkadot';

export interface Themeable {
  activeTheme: ThemeStyle;
}

export interface ThemeStyle {
  blockBackgroundColorHover: string;
  bodyBackground: string;
  borderRadius: string;
  buttonBackgroundColor: string;
  buttonBorderColor: string;
  buttonBorderColorHover: string;
  buttonTextColor: string;
  buttonTextColorHover: string;
  defaultTextColor: string;
  logoTextColor: string;
  menuButtonBackgroundColor: string;
  menuButtonTextColor: string;
  menuButtonBorderColor: string;
  menuButtonActiveBackgroundColor: string;
  menuButtonActiveTextColor: string;
  menuButtonActiveBorderColor: string;
}

export interface StatusEntry {
  type: ModalStatusTypes;
  message: StatusMessages;
}
