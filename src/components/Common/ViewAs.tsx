import { Dispatch, SetStateAction, memo, useCallback } from 'react';
import { styled } from 'styled-components';

import IconButton from '@buttons/IconButton.tsx';

import { ViewAsOptions } from '@helpers/config.ts';
import { UISettings } from '@helpers/interfaces.ts';

import ViewCardIcon from '@images/icons/view-card.svg';
import ViewTableIcon from '@images/icons/view-table.svg';

const SViewAs = styled.div`
  display: flex;
  justify-content: end;
  gap: 10px;
  margin-bottom: 20px;
`;

interface ViewAsProps {
  handleChange: Dispatch<SetStateAction<UISettings>>;
  storedUISettings: UISettings;
}

const ViewAs = ({ handleChange, storedUISettings }: ViewAsProps) => {
  const changeView = useCallback(
    (selectedView: ViewAsOptions) => {
      handleChange((prevState) => ({ ...prevState, viewAs: selectedView }));
    },
    [handleChange],
  );

  return (
    <SViewAs>
      <IconButton
        title='Cards view'
        className={storedUISettings.viewAs === ViewAsOptions.CARDS ? 'active' : 'no-bg'}
        icon={<ViewCardIcon />}
        action={() => changeView(ViewAsOptions.CARDS)}
      />
      <IconButton
        title='Table view'
        className={storedUISettings.viewAs === ViewAsOptions.TABLE ? 'active' : 'no-bg'}
        icon={<ViewTableIcon />}
        action={() => changeView(ViewAsOptions.TABLE)}
      />
    </SViewAs>
  );
};

export default memo(ViewAs);
