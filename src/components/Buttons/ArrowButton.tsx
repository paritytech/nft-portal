import { ReactElement, memo } from 'react';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { Themeable } from '@helpers/interfaces';

import ArrowIcon from '@images/icons/arrow.svg';

const SArrowButton = styled.button<Themeable>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 56px;
  padding: 0 12px;
  background-color: ${({ activeTheme }) => activeTheme.fill12};
  border: 0;
  border-radius: 12px;

  .arrow {
    width: 24px;
    height: 24px;
  }
`;

interface ArrowIconProps {
  children: ReactElement | string;
  action: () => void;
}

const ArrowButton = ({ children, action }: ArrowIconProps) => {
  const { theme } = useAccounts();

  return (
    <SArrowButton activeTheme={theme} onClick={action}>
      <div>{children}</div> <ArrowIcon className='arrow' />
    </SArrowButton>
  );
};

export default memo(ArrowButton);
