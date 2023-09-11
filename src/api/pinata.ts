import { IPFS_CID_VERSION } from '@helpers/config.ts';
import { CollectionMetadataData } from '@helpers/interfaces.ts';

export const saveDataToIpfs = async (metadata: CollectionMetadataData): Promise<string> => {
  const data = JSON.stringify({
    pinataContent: metadata,
    pinataOptions: {
      cidVersion: IPFS_CID_VERSION,
    },
  });

  const response = await fetch('/.netlify/functions/pin-data', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  }).then((res) => res.json());

  return response.ipfsCid;
};

export const saveImageToIpfs = async (sourceUrl?: string): Promise<string | null> => {
  if (typeof sourceUrl === 'undefined') {
    return null;
  }

  const blob = await fetch(sourceUrl).then((response) => response.blob());

  const formData = new FormData();
  formData.append('file', blob, window.crypto.randomUUID());
  formData.append('pinataOptions', JSON.stringify({ cidVersion: IPFS_CID_VERSION }));

  const response = await fetch('/.netlify/functions/pin-image', {
    method: 'post',
    body: formData,
  }).then((res) => res.json());

  return response.ipfsCid;
};
