import { StorageKey, u32 } from '@polkadot/types';
import { AccountId32 } from '@polkadot/types/interfaces';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { saveDataToIpfs } from '@api/pinata';

import { useAccounts } from '@contexts/AccountsContext';
import { useModalStatus } from '@contexts/ModalStatusContext';

import { IPFS_URL } from '@helpers/config';
import { ModalStatusTypes, StatusMessages } from '@helpers/constants';
import { handleError } from '@helpers/handleError';
import { MintAccessNft, NftMetadata, NftMetadataData } from '@helpers/interfaces';
import { absoluteRoutes } from '@helpers/routes';

export const useNfts = (collectionId: string) => {
  const { api, activeAccount, activeWallet } = useAccounts();
  const navigate = useNavigate();
  const { openModalStatus, setStatus, setAction } = useModalStatus();
  const [nftsMetadata, setNftsMetadata] = useState<NftMetadata[] | null>(null);
  const [nftMetadata, setNftMetadata] = useState<NftMetadata | null>(null);
  const [isNftDataLoading, setIsNftDataLoading] = useState(false);

  const getNftIds = useCallback(
    async (specifiedCollectionId = '') => {
      if (api && activeAccount && collectionId) {
        const collectionIdParam = specifiedCollectionId || collectionId;
        const results: StorageKey<[AccountId32, u32, u32]>[] = await api.query.nfts.account.keys(
          activeAccount.address,
          collectionIdParam,
        );

        const nftIds = results
          .map(({ args: { 2: nftId } }) => nftId)
          .sort((a, b) => a.cmp(b))
          .map((nftId) => nftId.toString());

        if (nftIds.length > 0) {
          return nftIds;
        }
      }

      return null;
    },
    [api, activeAccount, collectionId],
  );

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

        const rawMetadata = await api.query.nfts.itemMetadataOf.multi(
          ownedNftIds.map((ownedNftId) => [collectionId, ownedNftId]),
        );
        if (Array.isArray(rawMetadata) && rawMetadata.length > 0) {
          const fetchCalls = rawMetadata.map((metadata) => {
            const primitiveMetadata = metadata.toPrimitive() as any;
            if (!primitiveMetadata?.data) {
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
            const primitiveMetadata = rawMetadata.toPrimitive() as any;
            if (!primitiveMetadata?.data) {
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
    async (nftId: string, nftReceiver: string, mintAccessNft: MintAccessNft | null) => {
      if (api && activeAccount && activeWallet && collectionId) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          const unsub = await api.tx.nfts
            .mint(collectionId, nftId, nftReceiver, mintAccessNft)
            .signAndSend(activeAccount.address, { signer: activeWallet.signer }, ({ status, events }) => {
              if (status.isReady) {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.NFT_MINTING });
              }

              if (status.isFinalized) {
                unsub();

                events.some(({ event: { method } }) => {
                  if (method === 'ExtrinsicSuccess') {
                    setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.NFT_MINTED });

                    setAction(() => () => {
                      if (nftReceiver === activeAccount.address) {
                        navigate(absoluteRoutes.nftsEdit(collectionId, nftId));
                        return;
                      }

                      navigate(absoluteRoutes.nfts(collectionId));
                    });

                    return true;
                  }

                  if (method === 'ExtrinsicFailed') {
                    setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.ACTION_FAILED });

                    return true;
                  }

                  return false;
                });
              }
            });
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [api, activeAccount, activeWallet, collectionId, navigate, openModalStatus, setStatus, setAction],
  );

  const saveNftMetadata = useCallback(
    async (nftId: string, nftMetadata: NftMetadataData) => {
      if (api && activeAccount && activeWallet && collectionId) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          const metadataCid = await saveDataToIpfs(nftMetadata);

          const unsub = await api.tx.nfts
            .setMetadata(collectionId, nftId, metadataCid)
            .signAndSend(activeAccount.address, { signer: activeWallet.signer }, ({ events, status }) => {
              if (status.isReady) {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.METADATA_UPDATING });
              }

              if (status.isFinalized) {
                unsub();

                events.some(({ event: { method } }) => {
                  if (method === 'ExtrinsicSuccess') {
                    setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.METADATA_UPDATED });

                    setAction(() => () => navigate(absoluteRoutes.nfts(collectionId)));

                    return true;
                  }

                  if (method === 'ExtrinsicFailed') {
                    setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.ACTION_FAILED });

                    return true;
                  }

                  return false;
                });
              }
            });
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [api, activeAccount, activeWallet, collectionId, navigate, openModalStatus, setStatus, setAction],
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

  return {
    getNftIds,
    nftsMetadata,
    nftMetadata,
    mintNft,
    getNftMetadata,
    getNftsMetadata,
    saveNftMetadata,
    isNftDataLoading,
    getNft,
  };
};
