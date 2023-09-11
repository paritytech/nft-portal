import { memo } from 'react';
import { styled } from 'styled-components';

import Title from '@common/Title.tsx';
import ViewAs from '@common/ViewAs.tsx';

import { ViewAsOptions, ViewType } from '@helpers/config.ts';
import { UISettings } from '@helpers/interfaces.ts';
import { SContentBlockContainer } from '@helpers/reusableStyles.ts';

import { useLoadCollectionsMetadata } from '@hooks/useLoadCollectionsMetadata.ts';
import { LocalStorageKeys, defaultUISettings, useLocalStorage } from '@hooks/useLocalStorage.ts';

import CollectionCard from './CollectionCard.tsx';
import CollectionRow from './CollectionRow.tsx';

const STable = styled.table`
  td {
    padding: 10px;
  }
`;

interface CollectionsViewProps {
  viewType: ViewType;
}

const CollectionsView = ({ viewType }: CollectionsViewProps) => {
  const { collectionsMetadata } = useLoadCollectionsMetadata();
  const [storedUISettings, setStoredUISettings] = useLocalStorage<UISettings>(
    LocalStorageKeys.UI_SETTINGS,
    defaultUISettings,
  );

  if (collectionsMetadata === null) {
    return <>Gathering data... please wait</>;
  }

  if (Array.isArray(collectionsMetadata) && collectionsMetadata.length === 0) {
    return <>No collections found</>;
  }

  return (
    <>
      <Title className='main'>My Collections</Title>
      <ViewAs handleChange={setStoredUISettings} storedUISettings={storedUISettings} />
      <SContentBlockContainer>
        {storedUISettings.viewAs === ViewAsOptions.CARDS &&
          collectionsMetadata.map((collectionMetadata) => (
            <CollectionCard key={collectionMetadata.id} collectionMetadata={collectionMetadata} viewType={viewType} />
          ))}

        {storedUISettings.viewAs === ViewAsOptions.TABLE && (
          <STable>
            <tbody>
              {collectionsMetadata.map((collectionMetadata) => (
                <CollectionRow
                  key={collectionMetadata.id}
                  collectionMetadata={collectionMetadata}
                  viewType={viewType}
                />
              ))}
            </tbody>
          </STable>
        )}
      </SContentBlockContainer>
    </>
  );
};

export default memo(CollectionsView);
