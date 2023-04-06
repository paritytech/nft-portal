import type { Option, StorageKey } from '@polkadot/types';
import type { Enum, Struct } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AssetId } from '@polkadot/types/interfaces';
import type { PalletAssetsAssetDetails, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import {
  ChainThemes,
  ChainTitles,
  MintTypes,
  ModalStatusTypes,
  MultiAssetId,
  MultiAssets,
  RestrictionTypes,
  StatusMessages,
} from './constants';

// ==========
// INTERFACES
// ==========
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

export interface CollectionConfigJson {
  settings: number;
  maxSupply: number | null;
  mintSettings: {
    mintType: MintTypeJson;
    price: string | null;
    startBlock: number | null;
    endBlock: number | null;
    defaultItemSettings: number;
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
  backgroundSystem: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  textAndIconsPrimary: string;
  textAndIconsSecondary: string;
  textAndIconsTertiary: string;
  textAndIconsDisabled: string;

  buttonMainBackground: string;
  buttonMainText: string;
  buttonMainBackgroundHovered: string;

  buttonSecondaryBackground: string;
  buttonSecondaryText: string;
  buttonSecondaryBackgroundHovered: string;

  fill30: string;
  fill24: string;
  fill18: string;
  fill12: string;
  fill6: string;

  appliedOverlay: string;
  appliedHover: string;
  appliedStroke: string;
  appliedSeparator: string;

  accentsPink: string;
  accentsRed: string;
  accentsGreen: string;

  forcedWhite: string;
  forcedBlack: string;
}

export interface StatusEntry {
  type: ModalStatusTypes;
  message: StatusMessages;
}

export interface RestrictionMessage {
  type: RestrictionTypes;
  message: string;
}

export interface MintAccessNft {
  ownedItem: string;
}

export interface TokenBalance {
  id: AssetId;
  balance: BN;
}

export interface TokenMetadata extends TokenMetadataData {
  id: AssetId;
}

export interface TokenMetadataData {
  name: string | null;
  symbol: string | null;
  decimals: number;
  details: PalletAssetsAssetDetails | null;
}

export interface NativeTokenMetadata {
  name: string | null;
  decimals: number;
  issuance: BN | null;
}

export interface PalletAssetConversionPoolInfo extends Struct {
  readonly lpToken: AssetId;
}

export interface PalletAssetConversionMultiAssetId extends Enum {
  readonly isNative: boolean;
  readonly isAsset: boolean;
  readonly asAsset: AssetId;
  readonly type: MultiAssets;
}

export interface PoolInfo {
  poolId: PalletAssetConversionPoolId;
  lpToken: AssetId;
  reserves: PoolReserves;
}

// =====
// TYPES
// =====
export type MintType = MintTypes | { [MintTypes.HOLDER_OF]: string };

export type MintTypeJson = Record<'public' | 'issuer' | 'holderOf', null | number>;

export type PoolReserves = [number, number];

export type PalletAssetConversionPoolId = ITuple<
  [PalletAssetConversionMultiAssetId, PalletAssetConversionMultiAssetId]
>;

export type MetadataRecords = [StorageKey<[AssetId]>, PalletAssetsAssetMetadata][];

export type DetailsRecords = Option<PalletAssetsAssetDetails>[];

export type MultiAsset = MultiAssets | { [MultiAssets.ASSET]: AssetId };
