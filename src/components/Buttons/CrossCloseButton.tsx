import { memo } from 'react';
import CloseButton, { CloseButtonProps } from 'react-bootstrap/esm/CloseButton';

import { useAccounts } from '@contexts/AccountsContext';

import { CommonStyleProps } from '@helpers/interfaces';

interface CrossCloseButtonProps extends CloseButtonProps, CommonStyleProps {
  handleClose: (event: React.MouseEvent<HTMLElement>) => void;
}

const CrossCloseButton = ({ handleClose, className }: CrossCloseButtonProps) => {
  const { theme } = useAccounts();

  return <CloseButton variant={theme.closeButtonVariant} className={className} onClick={handleClose} />;
};

export default memo(CrossCloseButton);
