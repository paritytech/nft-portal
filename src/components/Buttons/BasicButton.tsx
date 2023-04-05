import { FormEvent, ReactElement, memo } from 'react';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { CommonStyleProps } from '@helpers/interfaces';
import { CssCommonButtonStyles } from '@helpers/reusableStyles';

const SButton = styled.button`
  ${CssCommonButtonStyles}
`;

interface BasicButtonProps extends CommonStyleProps {
  children: ReactElement | string;
}

const BasicButton = ({ children, type, className, isDisabled }: BasicButtonProps) => {
  const { theme } = useAccounts();

  const handleClick = (event: FormEvent) => {
    if (isDisabled) {
      event.preventDefault();
    }
  };

  return (
    <SButton type={type} className={className} isDisabled={isDisabled} activeTheme={theme} onClick={handleClick}>
      {children}
    </SButton>
  );
};

export default memo(BasicButton);
