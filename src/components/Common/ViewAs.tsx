import { Dispatch, SetStateAction, memo, useCallback } from 'react';
import { styled } from 'styled-components';

import IconButton from '@buttons/IconButton.tsx';

import { ViewAsOptions } from '@helpers/config.ts';
import { UiSettings } from '@helpers/interfaces.ts';

import ViewTableIcon from '@images/icons/view-table.svg';
import ViewTileIcon from '@images/icons/view-tile.svg';

const SViewAs = styled.div`
  display: flex;
  justify-content: end;
  gap: 10px;
  margin-bottom: 20px;
`;

interface ViewAsProps {
  handleChange: Dispatch<SetStateAction<UiSettings>>;
  uiSettings: UiSettings;
}

const ViewAs = ({ handleChange, uiSettings }: ViewAsProps) => {
  const changeView = useCallback(
    (selectedView: ViewAsOptions) => {
      handleChange((prevState) => ({ ...prevState, viewAs: selectedView }));
    },
    [handleChange],
  );

  return (
    <SViewAs>
      <IconButton
        title='Tile view'
        className={uiSettings.viewAs === ViewAsOptions.TILES ? 'active' : 'no-bg'}
        icon={<ViewTileIcon />}
        action={() => changeView(ViewAsOptions.TILES)}
      />
      <IconButton
        title='Table view'
        className={uiSettings.viewAs === ViewAsOptions.TABLE ? 'active' : 'no-bg'}
        icon={<ViewTableIcon />}
        action={() => changeView(ViewAsOptions.TABLE)}
      />
    </SViewAs>
  );
};

export default memo(ViewAs);
