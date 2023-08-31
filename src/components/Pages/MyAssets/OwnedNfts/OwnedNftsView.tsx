import { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';

import ViewAs from '@common/ViewAs.tsx';

import { ViewAsOptions, defaultUiSettings } from '@helpers/config.ts';
import { NftMetadata, UiSettings } from '@helpers/interfaces.ts';
import { SContentBlockContainer } from '@helpers/reusableStyles.ts';
import { routes } from '@helpers/routes.ts';

import { useLocalStorage } from '@hooks/useLocalStorage.ts';

import OwnedNftCard from './OwnedNftCard.tsx';
import OwnedNftRow from './OwnedNftRow.tsx';

const STable = styled.table`
  td {
    padding: 10px;
  }
`;

interface OwnedNftsViewProps {
  nftsMetadata: NftMetadata[] | null;
}

const OwnedNftsView = ({ nftsMetadata }: OwnedNftsViewProps) => {
  const navigate = useNavigate();
  const { collectionId } = useParams();
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
        {uiSettings.viewAs === ViewAsOptions.CARDS &&
          nftsMetadata.map((nftMetadata) => (
            <OwnedNftCard
              key={nftMetadata.id}
              nftMetadata={nftMetadata}
              openNft={() => navigate(routes.myAssets.ownedNft(collectionId, nftMetadata.id))}
            />
          ))}

        {uiSettings.viewAs === ViewAsOptions.TABLE && (
          <STable>
            <tbody>
              {nftsMetadata.map((nftMetadata) => (
                <OwnedNftRow
                  key={nftMetadata.id}
                  nftMetadata={nftMetadata}
                  openNft={() => navigate(routes.myAssets.ownedNft(collectionId, nftMetadata.id))}
                />
              ))}
            </tbody>
          </STable>
        )}
      </SContentBlockContainer>
    </>
  );
};

export default memo(OwnedNftsView);
