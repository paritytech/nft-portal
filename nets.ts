import { net } from 'capi/nets';

export const local = net.ws({
  url: 'ws://127.0.0.1:9944',
});
