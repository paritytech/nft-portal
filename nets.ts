// import { net } from 'capi';

// export const localhost = net.ws({
//   url: 'ws://127.0.0.1:9944',
// });


import { bins, net } from "capi"

const bin = bins({
  polkadot: ["polkadot-fast", "v0.9.42"],
})

export const westendDev = net.dev({
  bin: bin.polkadot,
  chain: "westend-dev",
})

export const westend = net.ws({
  url: 'wss://westend-rpc.polkadot.io/',
  version: 'v0.9.42',
  targets: {
    dev: westendDev
  }
});
