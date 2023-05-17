import { FormEvent, ReactElement, memo } from 'react';

import { CommonStyleProps } from '@helpers/interfaces.ts';
import { SActionButton } from '@helpers/reusableStyles.ts';

interface ActionButtonProps extends CommonStyleProps {
  children: ReactElement | string;
  action?: () => void;
}

const ActionButton = ({ children, type = 'button', action, className, isDisabled }: ActionButtonProps) => {
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
    <SActionButton type={type} className={className} isDisabled={isDisabled} onClick={handleClick}>
      {children}
    </SActionButton>
  );
};

export default memo(ActionButton);
