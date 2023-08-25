import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { saveDataToIpfs } from '@api/pinata.ts';

import { useAccounts } from '@contexts/AccountsContext.tsx';
import { useModalStatus } from '@contexts/ModalStatusContext.tsx';

import { ModalStatusTypes, StatusMessages } from '@helpers/config.ts';
import { handleError } from '@helpers/handleError.ts';
import { NftMetadata, NftMetadataData, NftWitnessData } from '@helpers/interfaces.ts';
import { routes } from '@helpers/routes.ts';
import { getCidHash, getCidUrl, getFetchableUrl } from '@helpers/utilities.ts';

export const useNfts = (collectionId: string) => {
  const { api, activeAccount, activeWallet } = useAccounts();
  const navigate = useNavigate();
  const { openModalStatus, setStatus, setAction } = useModalStatus();
  const [nftsMetadata, setNftsMetadata] = useState<NftMetadata[] | null>(null);
  const [nftMetadata, setNftMetadata] = useState<NftMetadata | null>(null);
  const [isNftDataLoading, setIsNftDataLoading] = useState(false);

  const getNftIds = useCallback(async () => {
    if (api) {
      const results = await api.query.nfts.item.keys(collectionId);

      const nftIds = results
        .map(({ args: [, nftId] }) => nftId)
        .sort((a, b) => a.cmp(b))
        .map((nftId) => nftId.toString());

      return nftIds;
    }
  }, [api, collectionId]);

  const getOwnedNftIds = useCallback(
    async (specifiedCollectionId = '') => {
      if (api && activeAccount && collectionId) {
        const collectionIdParam = specifiedCollectionId || collectionId;
        const results = await api.query.nfts.account.keys(activeAccount.address, collectionIdParam);

        const nftIds = results
          .map(({ args: [, , nftId] }) => nftId)
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

        const ownedNftIds = await getOwnedNftIds();
        if (!ownedNftIds) {
          setNftsMetadata(metadata);
          return;
        }

        const rawMetadata = await api.query.nfts.itemMetadataOf.multi(
          ownedNftIds.map((ownedNftId) => [collectionId, ownedNftId]),
        );
        if (Array.isArray(rawMetadata) && rawMetadata.length > 0) {
          const fetchCalls = rawMetadata.map((metadata) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const primitiveMetadata = metadata.toPrimitive() as any;
            if (!primitiveMetadata?.data) {
              return null;
            }

            return fetch(getFetchableUrl(primitiveMetadata.data));
          });

          const fetchedData = await Promise.all(fetchCalls);
          const parsedData = await Promise.all(fetchedData.map((data) => (data !== null ? data.json() : null)));

          metadata = parsedData.map((data, index) => ({
            id: ownedNftIds[index],
            name: data?.name,
            description: data?.description,
            image: getCidHash(data?.image),
          }));
        }

        setNftsMetadata(metadata);
      } catch (error) {
        //
      } finally {
        setIsNftDataLoading(false);
      }
    }
  }, [api, activeAccount, collectionId, getOwnedNftIds]);

  const getNftMetadata = useCallback(
    async (nftId: string) => {
      if (api && collectionId && nftId) {
        setIsNftDataLoading(true);

        try {
          let metadata: NftMetadata | null = null;

          const ownedNftIds = await getOwnedNftIds();
          if (!ownedNftIds || !ownedNftIds.includes(nftId)) {
            setNftMetadata(metadata);
            return;
          }

          const rawMetadata = await api.query.nfts.itemMetadataOf(collectionId, nftId);

          if (rawMetadata) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const primitiveMetadata = rawMetadata.toPrimitive() as any;
            if (!primitiveMetadata?.data) {
              return null;
            }

            const fetchedData = await fetch(getFetchableUrl(primitiveMetadata.data));

            metadata = await fetchedData.json();
            if (metadata?.image) {
              metadata.image = getCidHash(metadata.image);
            }
          }

          setNftMetadata(metadata);
        } catch (error) {
          //
        } finally {
          setIsNftDataLoading(false);
        }
      }
    },
    [api, collectionId, getOwnedNftIds],
  );

  const mintNft = useCallback(
    async (nftId: string, nftReceiver: string, nftMetadata: NftMetadataData, nftWitnessData: NftWitnessData) => {
      if (api && activeAccount && activeWallet && collectionId) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          if (nftMetadata.image) {
            nftMetadata.image = getCidUrl(nftMetadata.image);
          }
          const cid = await saveDataToIpfs(nftMetadata);
          const metadataCid = getCidUrl(cid);
          const mintTx = api.tx.nfts.mint(collectionId, nftId, nftReceiver, nftWitnessData);
          const setMetadataTx = api.tx.nfts.setMetadata(collectionId, nftId, metadataCid);
          const txBatch = api.tx.utility.batchAll([mintTx, setMetadataTx]);

          const unsub = await txBatch.signAndSend(
            activeAccount.address,
            { signer: activeWallet.signer },
            ({ status, events }) => {
              if (status.isReady) {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.NFT_MINTING });
              }

              if (status.isInBlock) {
                unsub();

                events.some(({ event: { method } }) => {
                  if (method === 'ExtrinsicSuccess') {
                    setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.NFT_MINTED });
                    setAction(() => () => {
                      navigate(routes.myAssets.nfts(collectionId));
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
            },
          );
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [api, activeAccount, activeWallet, collectionId, setStatus, openModalStatus, setAction, navigate],
  );

  const saveNftMetadata = useCallback(
    async (nftId: string, nftMetadata: NftMetadataData) => {
      if (api && activeAccount && activeWallet && collectionId) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          if (nftMetadata.image) {
            nftMetadata.image = getCidUrl(nftMetadata.image);
          }
          const cid = await saveDataToIpfs(nftMetadata);
          const metadataCid = getCidUrl(cid);

          const unsub = await api.tx.nfts
            .setMetadata(collectionId, nftId, metadataCid)
            .signAndSend(activeAccount.address, { signer: activeWallet.signer }, ({ events, status }) => {
              if (status.isReady) {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.METADATA_UPDATING });
              }

              if (status.isInBlock) {
                unsub();

                events.some(({ event: { method } }) => {
                  if (method === 'ExtrinsicSuccess') {
                    setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.METADATA_UPDATED });

                    setAction(() => () => navigate(routes.myAssets.nfts(collectionId)));

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
        } catch (error) {
          //
        }
      }
    },
    [api, collectionId],
  );

  return {
    getNftIds,
    getOwnedNftIds,
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
