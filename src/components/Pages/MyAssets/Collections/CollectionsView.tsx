import { memo } from 'react';
import { styled } from 'styled-components';

import ViewAs from '@common/ViewAs.tsx';

import { ViewAsSettings, defaultUiSettings } from '@helpers/config.ts';
import { UiSettings } from '@helpers/interfaces.ts';
import { SContentBlockContainer } from '@helpers/reusableStyles.ts';

import { useLoadCollectionsData } from '@hooks/useLoadCollectionsData.ts';
import { useLocalStorage } from '@hooks/useLocalStorage.ts';

import CollectionRow from './CollectionRow.tsx';
import CollectionTile from './CollectionTile.tsx';

const STable = styled.table`
  td {
    padding: 10px;
  }
`;

const CollectionsView = () => {
  const collectionsMetadata = useLoadCollectionsData();
  const [uiSettings, setUiSettings] = useLocalStorage<UiSettings>('ui-settings', defaultUiSettings);

  if (collectionsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(collectionsMetadata) && collectionsMetadata.length === 0) {
    return <>No collections found</>;
  }

  return (
    <>
      <ViewAs handleChange={setUiSettings} uiSettings={uiSettings} />
      <SContentBlockContainer>
        {uiSettings.viewAs === ViewAsSettings.TABLE && (
          <STable>
            <tbody>
              {collectionsMetadata.map((collectionMetadata) => (
                <CollectionRow key={collectionMetadata.id} collectionMetadata={collectionMetadata} />
              ))}
            </tbody>
          </STable>
        )}

        {uiSettings.viewAs === ViewAsSettings.TILES &&
          collectionsMetadata.map((collectionMetadata) => (
            <CollectionTile key={collectionMetadata.id} collectionMetadata={collectionMetadata} />
          ))}
      </SContentBlockContainer>
    </>
  );
};

export default memo(CollectionsView);
