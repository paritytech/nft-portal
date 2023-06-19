import type { Option, StorageKey } from '@polkadot/types';
import type { Enum, Struct } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AssetId } from '@polkadot/types/interfaces';
import type { PalletAssetsAssetDetails, PalletAssetsAssetMetadata } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import {
  ChainNativeTokenNames,
  ChainThemes,
  ChainTitles,
  MintTypes,
  ModalStatusTypes,
  MultiAssets,
  RestrictionTypes,
  StatusMessages,
} from './constants.ts';

// ==========
// INTERFACES
// ==========
export interface CommonStyleProps {
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  required?: boolean;
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
  nativeTokenName: ChainNativeTokenNames;
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

  fill80: string;
  fill48: string;
  fill30: string;
  fill25: string;
  fill24: string;
  fill18: string;
  fill12: string;
  fill10: string;
  fill8: string;
  fill6: string;

  appliedOverlay: string;
  appliedHover: string;
  appliedStroke: string;
  appliedSeparator: string;
  appliedButtonMain: string;
  appliedLightPinkBackground: string;
  appliedPinkHover: string;
  appliedPinkActive: string;

  accentsPink: string;
  accentsRed: string;
  accentsGreen: string;

  forcedWhite: string;
  forcedBlack: string;
}

export interface StatusEntry {
  type: ModalStatusTypes;
  message: StatusMessages | string;
}

export interface RestrictionMessage {
  type: RestrictionTypes;
  message: string;
}

export interface MintAccessNft {
  ownedItem: string;
}

export interface TokenMetadata extends TokenMetadataInfo {
  id: MultiAssetId;
}

export interface TokenMetadataInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export interface TokenWithSupply extends TokenMetadata {
  supply: BN | null;
}

export interface PalletAssetConversionPoolInfo extends Struct {
  readonly lpToken: AssetId;
}

export interface MultiAssetId extends Enum {
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

export type PoolReserves = [BN, BN];

export type PoolId = [MultiAssetId, MultiAssetId];

export type PalletAssetConversionPoolId = ITuple<[MultiAssetId, MultiAssetId]>;

export type TokensMetadataRecords = [StorageKey<[AssetId]>, PalletAssetsAssetMetadata][];

export type TokensDetailsRecords = Option<PalletAssetsAssetDetails>[];

export type TokensDetailsMap = Map<number, PalletAssetsAssetDetails | null>;
