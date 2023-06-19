import { FormEvent, ReactElement, memo } from 'react';

import { CommonStyleProps } from '@helpers/interfaces.ts';
import { SActionButton } from '@helpers/reusableStyles.ts';
import { handleActionClick } from '@helpers/utilities.ts';

interface ActionButtonProps extends CommonStyleProps {
  children: ReactElement | string;
  action?: () => void;
}

const ActionButton = ({ children, type = 'button', action, className, disabled }: ActionButtonProps) => (
  <SActionButton
    type={type}
    className={className}
    disabled={disabled}
    onClick={(event: FormEvent) => handleActionClick(event, disabled, action)}
  >
    {children}
  </SActionButton>
);

export default memo(ActionButton);
