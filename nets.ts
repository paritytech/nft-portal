import { net } from 'capi/nets';

import { ChainUrls } from '@helpers/constants.ts';

export const local = net.ws({
  url: ChainUrls.LOCALHOST,
});

export const westendAssetHub = net.ws({
  url: ChainUrls.WESTEND_ASSET_HUB,
});
