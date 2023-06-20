import type { RegistryTypes } from '@polkadot/types-codec/types';
import type { OverrideBundleType } from '@polkadot/types/types/registry';

import { ChainNativeTokenNames, ChainThemes, ChainTitles, ExtensionIds } from './constants.ts';
import { Chain } from './interfaces.ts';

export const APP_NAME = 'assets-portal';
export const IPFS_URL = 'https://gateway.pinata.cloud/ipfs/';
export const ADD_LIQUIDITY_SLIPPAGE = 0.5; // 0.5%

// TODO once we have design for light/polkadot-like theme then ChainThemes.POLKADOT should be set where appropriate
// first chain in the list will be default chain
export const chains: Chain[] = [
  {
    url: 'wss://westmint-rpc.polkadot.io',
    title: ChainTitles.WESTMINT,
    theme: ChainThemes.POLKADOT,
    nativeTokenName: ChainNativeTokenNames.WESTMINT,
  },
  {
    url: 'ws://127.0.0.1:9944',
    title: ChainTitles.LOCALHOST,
    theme: ChainThemes.POLKADOT,
    nativeTokenName: ChainNativeTokenNames.LOCALHOST,
  },
];

export const extensionConfig = {
  disallowed: [],
  supported: [
    {
      id: ExtensionIds.POLKADOTJS,
      title: 'Polkadot JS',
      description: 'Basic account injection and signer',
      urls: {
        main: '',
        browsers: {
          chrome:
            'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
          firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
        },
      },
    },
    {
      id: ExtensionIds.TALISMAN,
      title: 'Talisman',
      description:
        'Talisman is a Polkadot wallet that unlocks a new world of multichain web3 applications in the Paraverse',
      urls: {
        main: '',
        browsers: {
          chrome: 'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
          firefox: 'https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/',
        },
      },
    },
  ],
};

export const apiConfigRuntime: OverrideBundleType = {
  spec: {
    node: {
      runtime: {
        AssetConversionApi: [
          {
            methods: {
              get_reserves: {
                description: 'Get pool reserves',
                params: [
                  {
                    name: 'asset1',
                    type: 'PalletAssetConversionMultiAssetId',
                  },
                  {
                    name: 'asset2',
                    type: 'PalletAssetConversionMultiAssetId',
                  },
                ],
                type: 'Option<(Balance,Balance)>',
              },
              quote_price_exact_tokens_for_tokens: {
                description: 'Quote price: exact tokens for tokens',
                params: [
                  {
                    name: 'asset1',
                    type: 'PalletAssetConversionMultiAssetId',
                  },
                  {
                    name: 'asset2',
                    type: 'PalletAssetConversionMultiAssetId',
                  },
                  {
                    name: 'amount',
                    type: 'u128',
                  },
                  {
                    name: 'include_fee',
                    type: 'bool',
                  },
                ],
                type: 'Option<(Balance)>',
              },
              quote_price_tokens_for_exact_tokens: {
                description: 'Quote price: tokens for exact tokens',
                params: [
                  {
                    name: 'asset1',
                    type: 'PalletAssetConversionMultiAssetId',
                  },
                  {
                    name: 'asset2',
                    type: 'PalletAssetConversionMultiAssetId',
                  },
                  {
                    name: 'amount',
                    type: 'u128',
                  },
                  {
                    name: 'include_fee',
                    type: 'bool',
                  },
                ],
                type: 'Option<(Balance)>',
              },
            },
            version: 1,
          },
        ],
      },
    },
  },
};

export const apiConfigTypes: RegistryTypes = {
  PalletAssetConversionMultiAssetId: {
    _enum: {
      Native: null,
      Asset: 'AssetId',
    },
  },
};
