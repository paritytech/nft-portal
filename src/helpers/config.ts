import { ChainThemes, ChainTitles, ChainUrls, ExtensionIds } from './constants.ts';
import { Chain } from './interfaces.ts';

export const APP_NAME = 'nft-portal';
export const IPFS_URL = 'https://gateway.pinata.cloud/ipfs/';

// first chain in the list will be default chain
export const chains: Chain[] = [
  {
    url: ChainUrls.WESTEND_ASSET_HUB,
    title: ChainTitles.WESTEND_ASSET_HUB,
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
