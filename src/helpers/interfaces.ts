import type { Enum, Struct } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AssetId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import { ChainThemes, ChainTitles, MintTypes, ModalStatusTypes, StatusMessages, StatusTypes } from './constants';

export interface CommonStyleProps {
  className?: string;
  isDisabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
export interface CollectionMetadata extends CollectionMetadataData {
  id: string;
}

export interface CollectionMetadataData {
  name: string;
  description?: string;
  image?: string;
}

export interface CollectionMetadataPrimitive {
  data: string;
  deposit: string;
}

export interface CollectionConfig {
  settings: number;
  maxSupply?: number;
  mintSettings: {
    mintType: MintType;
    price?: string;
    startBlock?: number;
    endBlock?: number;
    defaultItemSettings: number;
  };
}

export interface CollectionConfigHuman {
  settings: string;
  maxSupply: string | null;
  mintSettings: {
    mintType: MintType;
    price: string | null;
    startBlock: string | null;
    endBlock: string | null;
    defaultItemSettings: string;
  };
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
  buttonMainBackgroundColor: string;
  buttonMainColor: string;
  buttonSecondaryBackgroundColor: string;
  buttonSecondaryColor: string;
  buttonTextColor: string;
  buttonTextColorHover: string;
  closeButtonBackgroundColor: string;
  closeButtonVariant: string | undefined;
  defaultTextColor: string;
  navigationBackground: string;
  navigationButtonBackgroundColor: string;
  navigationButtonTextColor: string;
  navigationButtonBorderColor: string;
  navigationButtonActiveBackgroundColor: string;
  navigationButtonActiveTextColor: string;
  navigationButtonActiveBorderColor: string;
  transparentHoverHighlight: string;
}

export interface StatusEntry {
  type: ModalStatusTypes;
  message: StatusMessages;
}

export type MintType = MintTypes | { [MintTypes.HOLDER_OF]: string };

export interface ContextualStatusMessage {
  statusType: StatusTypes;
  statusMessage: string;
}

export interface MintAccessNft {
  ownedItem: string;
}

export interface TokenBalance {
  id: number;
  balance: BN;
}

export interface TokenMetadata extends TokenMetadataData {
  id: number;
}

export interface TokenMetadataData {
  name: string | null;
  symbol: string | null;
  decimals: number;
}
export interface NativeTokenMetadata {
  name: string | null;
  decimals: number;
}

export interface PalletDexPoolInfo extends Struct {
  readonly lpToken: AssetId;
}

export interface PalletDexMultiAssetId extends Enum {
  readonly isNative: boolean;
  readonly isAsset: boolean;
  readonly asAsset: AssetId;
  readonly type: 'Native' | 'Asset';
}

export interface PalletDexPoolId extends ITuple<[PalletDexMultiAssetId, PalletDexMultiAssetId]> {}

export type PoolReserves = [number, number];

export interface PoolInfo {
  poolId: PalletDexPoolId;
  lpToken: AssetId;
  reserves: PoolReserves;
}
