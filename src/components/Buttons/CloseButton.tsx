import { memo } from 'react';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountsContext';

import { CommonStyleProps, Themeable } from '@helpers/interfaces';

import CrossIcon from '@images/icons/cross.svg';

const SCloseButton = styled.button<Themeable>`
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

interface CloseButtonProps extends CommonStyleProps {
  handleClose: (event: React.MouseEvent<HTMLElement>) => void;
}

const CloseButton = ({ handleClose, className }: CloseButtonProps) => {
  const { theme } = useAccounts();

  return (
    <SCloseButton className={className} onClick={handleClose} activeTheme={theme}>
      <CrossIcon />
    </SCloseButton>
  );
};

export default memo(CloseButton);
