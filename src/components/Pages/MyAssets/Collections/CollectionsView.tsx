import { memo } from 'react';
import { styled } from 'styled-components';

import Title from '@common/Title.tsx';
import ViewAs from '@common/ViewAs.tsx';

import { ViewAsOptions, defaultUiSettings } from '@helpers/config.ts';
import { UiSettings } from '@helpers/interfaces.ts';
import { SContentBlockContainer } from '@helpers/reusableStyles.ts';

import { useLoadCollectionsData } from '@hooks/useLoadCollectionsData.ts';
import { useLocalStorage } from '@hooks/useLocalStorage.ts';

import CollectionCard from './CollectionCard.tsx';
import CollectionRow from './CollectionRow.tsx';

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
      <Title className='main'>My Collections</Title>
      <ViewAs handleChange={setUiSettings} uiSettings={uiSettings} />
      <SContentBlockContainer>
        {uiSettings.viewAs === ViewAsOptions.CARDS &&
          collectionsMetadata.map((collectionMetadata) => (
            <CollectionCard key={collectionMetadata.id} collectionMetadata={collectionMetadata} />
          ))}

        {uiSettings.viewAs === ViewAsOptions.TABLE && (
          <STable>
            <tbody>
              {collectionsMetadata.map((collectionMetadata) => (
                <CollectionRow key={collectionMetadata.id} collectionMetadata={collectionMetadata} />
              ))}
            </tbody>
          </STable>
        )}
      </SContentBlockContainer>
    </>
  );
};

export default memo(CollectionsView);
