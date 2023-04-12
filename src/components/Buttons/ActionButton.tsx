import { FormEvent, ReactElement, memo } from 'react';

import { useAccounts } from '@contexts/AccountsContext';

import { CommonStyleProps } from '@helpers/interfaces';
import { SActionButton } from '@helpers/reusableStyles';

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
    <SActionButton type={type} className={className} isDisabled={isDisabled} activeTheme={theme} onClick={handleClick}>
      {children}
    </SActionButton>
  );
};

export default memo(ActionButton);
