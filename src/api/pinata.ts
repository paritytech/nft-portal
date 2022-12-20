import { CollectionMetadataData } from '@helpers/interfaces';

export const saveToIpfs = async (metadata: CollectionMetadataData): Promise<string> => {
  const data = JSON.stringify({
    pinataContent: metadata,
  });

  const response = await fetch('/.netlify/functions/pinata', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  }).then((res) => res.json());

  return response.ipfsHash;
};
