import Hash from 'ipfs-only-hash';

export const prefecthCid = async (file: File): Promise<{ cid: string; url: string }> => {
  const url = URL.createObjectURL(file);
  const arrayBuffer = await fetch(url).then((response) => response.arrayBuffer());
  const cid = await Hash.of(new Uint8Array(arrayBuffer));

  return { cid, url };
};
