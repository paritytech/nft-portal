import { FormEvent, ReactElement, memo } from 'react';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { CommonStyleProps } from '@helpers/interfaces';
import { CssButtonMainStyles, CssButtonSecondaryStyles } from '@helpers/reusableStyles';

const SButton = styled.button`
  &.main {
    ${CssButtonMainStyles}
  }

  &.secondary {
    ${CssButtonSecondaryStyles}
  }
`;

interface ActionButtonProps extends CommonStyleProps {
  children: ReactElement | string;
  action?: () => void;
}

const ActionButton = ({ children, type = 'button', action, className, isDisabled }: ActionButtonProps) => {
  const { theme } = useAccounts();

  const handleClick = (event: FormEvent) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    if (typeof action !== 'undefined') {
      event.preventDefault();
      action();
    }
  };

  return (
    <SButton type={type} className={className} isDisabled={isDisabled} activeTheme={theme} onClick={handleClick}>
      {children}
    </SButton>
  );
};

export default memo(ActionButton);
