export const APP_NAME = 'assets-portal';

export const extensionConfig = {
  disallowed: [],
  supported: [
    {
      id: 'polkadot-js',
      title: 'polkadotJS',
      description: 'Basic account injection and signer',
      urls: {
        main: '',
        browsers: {
          chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
          firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
        },
      },
    },
    {
      id: 'talisman',
      title: 'talisman',
      description: 'Talisman is a Polkadot wallet that unlocks a new world of multichain web3 applications in the Paraverse',
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

export const IPFS_URL = 'https://gateway.pinata.cloud/ipfs/';

export const deviceScreenSize = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
};

export const styleSettings = {
  colors: {
    alto: '#D9D9D9',
    blackHaze: '#f4f5f5',
    cerise: '#D33079',
    jaffa: '#F19135',
    shark: '#212529',
    white: '#FFFFFF',
  },
  mediaQueries: {
    mobile: `(min-width: ${deviceScreenSize.mobile})`,
    tablet: `(min-width: ${deviceScreenSize.tablet})`,
    desktop: `(min-width: ${deviceScreenSize.desktop})`,
  },
  sizes: {
    largeText: '36px',
    majorText: '30px',
    emphasizedText: '20px',
    mediumText: '16px',
    smallText: '12px',
  },
};
