import { memo } from 'react';
import { styled } from 'styled-components';

import ViewAs from '@common/ViewAs.tsx';

import { ViewAsOptions, defaultUiSettings } from '@helpers/config.ts';
import { NftMetadata, UiSettings } from '@helpers/interfaces.ts';
import { SContentBlockContainer } from '@helpers/reusableStyles.ts';

import { useLocalStorage } from '@hooks/useLocalStorage.ts';

import NftRow from './NftRow.tsx';
import NftTile from './NftTile.tsx';

const STable = styled.table`
  td {
    padding: 10px;
  }
`;

interface NftsViewProps {
  nftsMetadata: NftMetadata[] | null;
}

const NftsView = ({ nftsMetadata }: NftsViewProps) => {
  const [uiSettings, setUiSettings] = useLocalStorage<UiSettings>('ui-settings', defaultUiSettings);

  if (nftsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(nftsMetadata) && nftsMetadata.length === 0) {
    return <>No NFTs found</>;
  }

  return (
    <>
      <ViewAs handleChange={setUiSettings} uiSettings={uiSettings} />
      <SContentBlockContainer>
        {uiSettings.viewAs === ViewAsOptions.TABLE && (
          <STable>
            <tbody>
              {nftsMetadata.map((nftMetadata) => (
                <NftRow key={nftMetadata.id} nftMetadata={nftMetadata} />
              ))}
            </tbody>
          </STable>
        )}

        {uiSettings.viewAs === ViewAsOptions.TILES &&
          nftsMetadata.map((nftMetadata) => <NftTile key={nftMetadata.id} nftMetadata={nftMetadata} />)}
      </SContentBlockContainer>
    </>
  );
};

export default memo(NftsView);
