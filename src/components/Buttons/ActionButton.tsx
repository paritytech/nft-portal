import { FormEvent, memo } from 'react';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { CommonStyleProps } from '@helpers/interfaces';
import { CommonButtonStyles } from '@helpers/reusableStyles';

const SButton = styled.button`
  ${CommonButtonStyles}
`;

interface ActionButtonProps extends CommonStyleProps {
  children: any;
  action: () => void;
}

const ActionButton = ({ children, action, className, isDisabled }: ActionButtonProps) => {
  const { theme } = useAccounts();

  const handleClick = (event: FormEvent) => {
    event.preventDefault();

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
