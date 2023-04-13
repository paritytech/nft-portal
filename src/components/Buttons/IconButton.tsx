import { ReactElement, memo } from 'react';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { CommonStyleProps, Themeable } from '@helpers/interfaces';

const SIconButton = styled.button<Themeable>`
  background-color: ${({ activeTheme }) => activeTheme.fill6};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 0;
  padding: 0;
  border-radius: 32px;

  svg {
    width: 24px;
    height: 24px;
  }
`;

interface IconButtonProps extends CommonStyleProps {
  icon: ReactElement;
  action: () => void;
}

const IconButton = ({ icon, action, className }: IconButtonProps) => {
  const { theme } = useAccounts();

  return (
    <SIconButton className={className} onClick={action} activeTheme={theme}>
      {icon}
    </SIconButton>
  );
};

export default memo(IconButton);
