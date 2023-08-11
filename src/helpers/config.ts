import { WalletConnectConfiguration } from '@common/WalletConnect/types.ts';

import { ChainThemes, ChainTitles, ChainUrls, ExtensionIds } from './constants.ts';
import { Chain } from './interfaces.ts';

export const APP_NAME = 'nft-portal';
export const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;
export const IPFS_NATIVE_SCHEME = 'ipfs://';

// first chain in the list will be default chain
export const chains: Chain[] = [
  {
    url: ChainUrls.POLKADOT_ASSET_HUB,
    title: ChainTitles.POLKADOT_ASSET_HUB,
    theme: ChainThemes.POLKADOT,
  },
  {
    url: ChainUrls.KUSAMA_ASSET_HUB,
    title: ChainTitles.KUSAMA_ASSET_HUB,
    theme: ChainThemes.POLKADOT,
  },
  {
    url: ChainUrls.WESTEND_ASSET_HUB,
    title: ChainTitles.WESTEND_ASSET_HUB,
    theme: ChainThemes.POLKADOT,
  },
  {
    url: ChainUrls.ROCOCO_ASSET_HUB,
    title: ChainTitles.ROCOCO_ASSET_HUB,
    theme: ChainThemes.POLKADOT,
  },
  {
    url: ChainUrls.LOCALHOST,
    title: ChainTitles.LOCALHOST,
    theme: ChainThemes.POLKADOT,
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
      id: ExtensionIds.SUB_WALLET,
      title: 'SubWallet',
      description: 'Comprehensive Web3 wallet solution for Polkadot, Substrate & Ethereum ecosystems',
      urls: {
        main: '',
        browsers: {
          chrome:
            'https://chrome.google.com/webstore/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
          firefox: 'https://addons.mozilla.org/en-US/firefox/addon/subwallet/',
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

export const walletConnectParams: WalletConnectConfiguration = {
  chainIds: [
    'polkadot:68d56f15f85d3136970ec16946040bc1', // polkadot asset hub
    'polkadot:48239ef607d7928874027a43a6768920', // kusama asset hub
  ],
  optionalChainIds: [
    'polkadot:67f9723393ef76214df0118c34bbbd3d', // westend asset hub
    'polkadot:7c34d42fc815d392057c78b49f2755c7', // rococo asset hub
  ],
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID!,
  relayUrl: 'wss://relay.walletconnect.com',
  metadata: {
    name: 'WalletConnect',
    description: 'WalletConnect',
    url: process.env.REACT_APP_WALLET_CONNECT_WEBSITE_URL!,
    icons: [],
  },
};
