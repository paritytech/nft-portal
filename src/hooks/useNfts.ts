import { useCallback, useState } from 'react';
import { StorageKey, u32 } from '@polkadot/types';
import { AccountId32 } from '@polkadot/types/interfaces';

import { saveToIpfs } from '@api/pinata';
import { IPFS_URL } from '@helpers/config';
import { NftMetadata, NftMetadataData } from '@helpers/interfaces';
import { useAccounts } from '@contexts/AccountContext';
import { useNavigate } from 'react-router-dom';
import { routes } from '@helpers/routes';

export const useNfts = (collectionId: string) => {
  const { api, activeAccount, activeWallet } = useAccounts();
  const navigate = useNavigate();
  const [nftsMetadata, setNftsMetadata] = useState<NftMetadata[] | null>(null);
  const [nftMetadata, setNftMetadata] = useState<NftMetadata | null>(null);
  const [isNftDataLoading, setIsNftDataLoading] = useState(false);
  const [isNftDataSaving, setIsNftDataSaving] = useState(false);

  const getNftIds = useCallback(async () => {
    if (api && activeAccount && collectionId) {
      const results: StorageKey<[AccountId32, u32, u32]>[] = await api.query.nfts.account.keys(activeAccount.address, collectionId);

      const nftIds = results
        .map(({ args: [, , nftId] }) => nftId)
        .sort((a, b) => a.cmp(b))
        .map((nftId) => nftId.toString());

      if (nftIds.length > 0) {
        return nftIds;
      }
    }

    return null;
  }, [api, activeAccount, collectionId]);

  const getNftsMetadata = useCallback(async () => {
    if (api && activeAccount && collectionId) {
      setIsNftDataLoading(true);

      try {
        let metadata: NftMetadata[] = [];

        const ownedNftIds = await getNftIds();
        if (!ownedNftIds) {
          setNftsMetadata(metadata);
          return;
        }

        const rawMetadata = await api.query.nfts.itemMetadataOf.multi(ownedNftIds.map((ownedNftId) => [collectionId, ownedNftId]));

        if (Array.isArray(rawMetadata) && rawMetadata.length > 0) {
          const fetchCalls = rawMetadata.map((metadata) => {
            const primitiveMetadata = metadata.toPrimitive() as any; // TODO can't import proper type

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
      } catch (error) {
      } finally {
        setIsNftDataLoading(false);
      }
    }
  }, [api, activeAccount, collectionId, getNftIds]);

  const getNftMetadata = useCallback(
    async (nftId: string) => {
      if (api && collectionId && nftId) {
        setIsNftDataLoading(true);

        try {
          let metadata: NftMetadata | null = null;

          const ownedNftIds = await getNftIds();
          if (!ownedNftIds || !ownedNftIds.includes(nftId)) {
            setNftMetadata(metadata);
            return;
          }

          const rawMetadata = await api.query.nfts.itemMetadataOf(collectionId, nftId);

          if (rawMetadata) {
            const primitiveMetadata = rawMetadata.toPrimitive() as any; // TODO can't import proper type
            if (primitiveMetadata === null) {
              return null;
            }

            const fetchedData = await fetch(`${IPFS_URL}${primitiveMetadata.data}`);

            metadata = await fetchedData.json();
          }

          setNftMetadata(metadata);
        } catch (error) {
        } finally {
          setIsNftDataLoading(false);
        }
      }
    },
    [api, collectionId, getNftIds],
  );

  const mintNft = useCallback(
    async (nftId: string) => {
      if (api && activeAccount && activeWallet && collectionId) {
        setIsNftDataSaving(true);

        try {
          const unsub = await api.tx.nfts.mint(collectionId, nftId, null).signAndSend(activeAccount.address, { signer: activeWallet.signer }, ({ status }) => {
            if (status.isFinalized) {
              setIsNftDataSaving(false);
              navigate(routes.nfts(collectionId));
              unsub();
            }
          });
        } catch (error) {
          setIsNftDataSaving(false);
        }
      }
    },
    [api, activeAccount, activeWallet, collectionId, navigate],
  );

  const saveNftMetadata = useCallback(
    async (nftId: string, nftMetadata: NftMetadataData) => {
      if (api && activeAccount && activeWallet && collectionId) {
        setIsNftDataSaving(true);

        try {
          const metadataCid = await saveToIpfs(nftMetadata);

          await api.tx.nfts.setMetadata(collectionId, nftId, metadataCid).signAndSend(activeAccount.address, { signer: activeWallet.signer });
        } catch (error) {
        } finally {
          setIsNftDataSaving(false);
        }
      }
    },
    [api, activeAccount, activeWallet, collectionId],
  );

  const getNft = useCallback(
    async (nftId: string) => {
      if (api && collectionId) {
        try {
          const response = await api.query.nfts.item(collectionId, nftId);
          return response.toHuman();
        } catch (error) {}
      }
    },
    [api, collectionId],
  );

  return { nftsMetadata, nftMetadata, mintNft, getNftMetadata, getNftsMetadata, saveNftMetadata, isNftDataLoading, isNftDataSaving, getNft };
};
