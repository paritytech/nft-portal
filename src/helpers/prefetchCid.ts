import { BlackHoleBlockstore } from 'blockstore-core/black-hole';
import { importer } from 'ipfs-unixfs-importer';

const block = new BlackHoleBlockstore();

export const prefecthCid = async (file: File): Promise<{ cid: string; url: string }> => {
  const url = URL.createObjectURL(file);
  const arrayBuffer = await fetch(url).then((response) => response.arrayBuffer());

  for await (const { cid } of importer([{ content: new Uint8Array(arrayBuffer) }], block)) {
    return { cid: cid.toV1().toString(), url };
  }

  throw new Error('failed to prefetch cid');
};
