import { useCallback, useEffect, useState } from 'react';
import { StorageKey, u32 } from '@polkadot/types';
import { AccountId32 } from '@polkadot/types/interfaces';

import { saveToIpfs } from '../api';
import { NftMetadata, NftMetadataData } from '../constants';
import { useAccounts } from '../Contexts';
import { IPFS_URL } from '../helpers';

export const useNfts = (collectionId: string) => {
  const { api, activeAccount, activeWallet } = useAccounts();
  const [ownedNftIds, setOwnedNftIds] = useState<string[] | null>(null);
  const [nftsMetadata, setNftsMetadata] = useState<NftMetadata[] | null>(null);
  const [nftMetadata, setNftMetadata] = useState<NftMetadata | null>(null);
  const [isNftDataLoading, setIsNftDataLoading] = useState(false);

  const mintNft = useCallback(
    async (nftId: string) => {
      if (api && activeAccount && activeWallet && collectionId) {
        await api.tx.nfts.mint(collectionId, nftId, null).signAndSend(activeAccount.address, { signer: activeWallet.signer });
      }
    },
    [api, activeAccount, activeWallet, collectionId],
  );

  const getNftIds = useCallback(async () => {
    if (api && activeAccount && collectionId) {
      setIsNftDataLoading(true);

      try {
        const results: StorageKey<[AccountId32, u32, u32]>[] = await api.query.nfts.account.keys(activeAccount.address, collectionId);

        const nftIds = results
          .map(({ args: [, , nftId] }) => nftId)
          .sort((a, b) => a.cmp(b))
          .map((nftId) => nftId.toString());

        if (nftIds.length > 0) {
          setOwnedNftIds(nftIds);
        }
      } catch (error) {
        //TODO handle error
      } finally {
        setIsNftDataLoading(false);
      }
    }

    return [];
  }, [api, activeAccount, collectionId]);

  const getNftsMetadata = useCallback(async () => {
    if (api && activeAccount && collectionId && ownedNftIds) {
      let metadata: NftMetadata[] = [];

      const rawMetadata = await api.query.nfts.itemMetadataOf.multi(ownedNftIds.map((ownedNftId) => [collectionId, ownedNftId]));

      if (Array.isArray(rawMetadata) && rawMetadata.length > 0) {
        const fetchCalls = rawMetadata.map((metadata) => {
          const primitiveMetadata = metadata.toPrimitive() as any;

          if (primitiveMetadata === null) {
            return null;
          }

          return fetch(`${IPFS_URL}${primitiveMetadata.data}`);
        });

        const fetchedData = await Promise.all(fetchCalls);
        const parsedData = await Promise.all(fetchedData.map((data) => (data !== null ? data.json() : null)));

        metadata = parsedData.map((data, index) => ({
          id: ownedNftIds[index],
          name: data?.name,
          description: data?.description || null,
          image: data?.image || null,
        }));
      }

      setNftsMetadata(metadata);
    }
  }, [api, activeAccount, collectionId, ownedNftIds]);

  const getNftMetadata = useCallback(
    async (nftId: string) => {
      if (api && collectionId && nftId && ownedNftIds && ownedNftIds.includes(nftId)) {
        setIsNftDataLoading(true);

        try {
          let metadata: NftMetadata | null = null;
          const rawMetadata = await api.query.nfts.itemMetadataOf(collectionId, nftId);

          if (rawMetadata) {
            const primitiveMetadata = rawMetadata.toPrimitive() as any; //TODO can't import proper type
            if (primitiveMetadata === null) {
              return null;
            }

            const fetchedData = await fetch(`${IPFS_URL}${primitiveMetadata.data}`);

            metadata = await fetchedData.json();
          }

          setNftMetadata(metadata);
        } catch (error) {
          //TODO handle error
        } finally {
          setIsNftDataLoading(false);
        }
      }
    },
    [api, collectionId, ownedNftIds],
  );

  const saveNftMetadata = useCallback(
    async (nftId: string, nftMetadata: NftMetadataData) => {
      if (api && activeAccount && activeWallet && collectionId) {
        const metadataCid = await saveToIpfs(nftMetadata);

        await api.tx.nfts.setMetadata(collectionId, nftId, metadataCid).signAndSend(activeAccount.address, { signer: activeWallet.signer });
      }
    },
    [api, activeAccount, activeWallet, collectionId],
  );

  useEffect(() => {
    if (collectionId) {
      getNftIds();
    }
  }, [getNftIds, collectionId]);

  return { nftsMetadata, nftMetadata, mintNft, getNftMetadata, getNftsMetadata, saveNftMetadata, isNftDataLoading };
};
