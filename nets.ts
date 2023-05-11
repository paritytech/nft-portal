import { net } from 'capi';

export const westend = net.ws({
  url: 'wss://westend-rpc.polkadot.io/',
  version: 'v0.9.42',
});
