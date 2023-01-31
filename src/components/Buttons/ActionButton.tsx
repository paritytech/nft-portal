import { memo } from 'react';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountContext';

import { CommonStyleProps } from '@helpers/interfaces';

const SButton = styled.button<CommonStyleProps>`
  line-height: 50px;
  padding: 0 50px;
  color: ${({ activeTheme }) => activeTheme.buttonTextColor};
  background-color: ${({ activeTheme }) => activeTheme.buttonBackgroundColor};
  font-size: 20px;
  border-radius: 10px;
  border: 0;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  }
`;

interface ActionButtonProps extends CommonStyleProps {
  children: any;
  action: () => void;
}

const ActionButton = ({ children, action, className, isDisabled }: ActionButtonProps) => {
  const { theme } = useAccounts();

  const handleClick = () => {
    if (isDisabled) {
      return;
    }

    action();
  };

  return (
    <SButton className={className} isDisabled={isDisabled} activeTheme={theme} onClick={handleClick}>
      {children}
    </SButton>
  );
};

export default memo(ActionButton);
