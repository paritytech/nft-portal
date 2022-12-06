import axios from 'axios';

import { CollectionMetadataData } from '../constants';

// TODO will need to use netlify or something else in order to not expose API keys 
export const saveToIpfs = async (metadata: CollectionMetadataData): Promise<string> => {
  const data = JSON.stringify({
    pinataContent: metadata,
  });

  const call = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: '%PINATA_KEY%', // do not push actual key to github
      pinata_secret_api_key: '%PINATA_API_KEY%', // do not push actual key to github
    },
    data,
  };

  const res = await axios(call);

  return res.data.IpfsHash;
};
