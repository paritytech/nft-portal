import { FrameSystemEvent, MintWitness, PalletNftsEvent, RuntimeEvent, local } from '@capi/local';
import { StorageKey, u32 } from '@polkadot/types';
import { AccountId32 } from '@polkadot/types/interfaces';
import { Rune, SignerError, is } from 'capi';
import { signature } from 'capi/patterns/signature/statemint';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { saveDataToIpfs } from '@api/pinata.ts';

import { useAccounts } from '@contexts/AccountsContext.tsx';
import { useModalStatus } from '@contexts/ModalStatusContext.tsx';

import { IPFS_URL } from '@helpers/config.ts';
import { ModalStatusTypes, StatusMessages } from '@helpers/constants.ts';
import { handleError } from '@helpers/handleError.ts';
import { NftMetadata, NftMetadataData } from '@helpers/interfaces.ts';
import { routes } from '@helpers/routes.ts';
import { toMultiAddress, toUint8Array } from '@helpers/utilities.ts';

export const useNfts = (collectionId: string) => {
  const { api, activeAccount, activeWallet, sender } = useAccounts();
  const navigate = useNavigate();
  const { openModalStatus, setStatus, setAction } = useModalStatus();
  const [nftsMetadata, setNftsMetadata] = useState<NftMetadata[] | null>(null);
  const [nftMetadata, setNftMetadata] = useState<NftMetadata | null>(null);
  const [isNftDataLoading, setIsNftDataLoading] = useState(false);

  const getNftIds = useCallback(async () => {
    if (api) {
      const results: StorageKey<[u32, u32]>[] = await api.query.nfts.item.keys(collectionId);

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
        const results: StorageKey<[AccountId32, u32, u32]>[] = await api.query.nfts.account.keys(
          activeAccount.address,
          collectionIdParam,
        );

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

            const fetchedData = await fetch(`${IPFS_URL}${primitiveMetadata.data}`);

            metadata = await fetchedData.json();
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
    async (nftId: string, nftReceiver: string, nftMetadata: NftMetadataData, mintAccessNft?: MintWitness) => {
      if (activeAccount && collectionId && sender) {
        setStatus({ type: ModalStatusTypes.INIT_TRANSACTION, message: StatusMessages.TRANSACTION_CONFIRM });
        openModalStatus();

        try {
          const metadataCid = await saveDataToIpfs(nftMetadata);
          const parsedCollectionId = parseInt(collectionId, 10);
          const parsedNftId = parseInt(nftId, 10);

          const sent = local.Utility.batchAll({
            calls: Rune.array([
              local.Nfts.mint({
                collection: parsedCollectionId,
                item: parsedNftId,
                mintTo: toMultiAddress(nftReceiver),
                witnessData: mintAccessNft,
              }),
              local.Nfts.setMetadata({
                collection: parsedCollectionId,
                item: parsedNftId,
                data: toUint8Array(metadataCid),
              }),
            ]),
          })
            .signed(
              signature({
                sender,
              }),
            )
            .sent()
            .dbgStatus('Mint NFT:');

          sent
            .transactionStatuses((status) => {
              // TODO update to a specific method after merge of https://github.com/paritytech/capi/pull/1176
              if (status === 'ready') {
                setStatus({ type: ModalStatusTypes.IN_PROGRESS, message: StatusMessages.NFT_MINTING });
              }

              return false;
            })
            .rehandle(is(SignerError), (error) => error.access('inner'))
            .run();

          const inBlockEvents = await sent.inBlockEvents().run();

          inBlockEvents.some(({ event }) => {
            if (RuntimeEvent.isNfts(event) && PalletNftsEvent.isItemMetadataSet(event.value)) {
              setStatus({ type: ModalStatusTypes.COMPLETE, message: StatusMessages.NFT_MINTED });

              setAction(() => () => {
                navigate(routes.myAssets.nfts(collectionId));
              });

              return true;
            }

            if (RuntimeEvent.isSystem(event) && FrameSystemEvent.isExtrinsicFailed(event.value)) {
              setStatus({ type: ModalStatusTypes.ERROR, message: StatusMessages.ACTION_FAILED });

              return true;
            }

            return false;
          });
        } catch (error) {
          setStatus({ type: ModalStatusTypes.ERROR, message: handleError(error) });
        }
      }
    },
    [activeAccount, collectionId, sender, setStatus, openModalStatus, setAction, navigate],
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
