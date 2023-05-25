import { net } from 'capi';

export const local = net.ws({
  url: 'ws://127.0.0.1:9944',
});
