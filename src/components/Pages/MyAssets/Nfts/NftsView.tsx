import { memo } from 'react';
import { styled } from 'styled-components';

import ViewAs from '@common/ViewAs.tsx';

import { ViewAsOptions, ViewType } from '@helpers/config.ts';
import { NftMetadata, UISettings } from '@helpers/interfaces.ts';
import { SContentBlockContainer } from '@helpers/reusableStyles.ts';

import { LocalStorageKeys, defaultUISettings, useLocalStorage } from '@hooks/useLocalStorage.ts';

import NftCard from './NftCard.tsx';
import NftRow from './NftRow.tsx';

const STable = styled.table`
  td {
    padding: 10px;
  }
`;

interface NftsViewProps {
  nftsMetadata: NftMetadata[] | null;
  viewType: ViewType;
}

const NftsView = ({ nftsMetadata, viewType }: NftsViewProps) => {
  const [storedUISettings, setStoredUISettings] = useLocalStorage<UISettings>(LocalStorageKeys.LSK_UI_SETTINGS, defaultUISettings);

  if (nftsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(nftsMetadata) && nftsMetadata.length === 0) {
    return <>No NFTs found</>;
  }

  return (
    <>
      <ViewAs handleChange={setStoredUISettings} storedUISettings={storedUISettings} />
      <SContentBlockContainer>
        {storedUISettings.viewAs === ViewAsOptions.CARDS &&
          nftsMetadata.map((nftMetadata) => (
            <NftCard key={nftMetadata.id} nftMetadata={nftMetadata} viewType={viewType} />
          ))}

        {storedUISettings.viewAs === ViewAsOptions.TABLE && (
          <STable>
            <tbody>
              {nftsMetadata.map((nftMetadata) => (
                <NftRow key={nftMetadata.id} nftMetadata={nftMetadata} viewType={viewType} />
              ))}
            </tbody>
          </STable>
        )}
      </SContentBlockContainer>
    </>
  );
};

export default memo(NftsView);
