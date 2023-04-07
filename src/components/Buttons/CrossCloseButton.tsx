import { memo } from 'react';
import CloseButton, { CloseButtonProps } from 'react-bootstrap/esm/CloseButton';

import { CommonStyleProps } from '@helpers/interfaces';

interface CrossCloseButtonProps extends CloseButtonProps, CommonStyleProps {
  handleClose: (event: React.MouseEvent<HTMLElement>) => void;
}

const CrossCloseButton = ({ handleClose, className }: CrossCloseButtonProps) => {
  // TODO use custom icon based button, would be easier to control
  return <CloseButton className={className} onClick={handleClose} />;
};

export default memo(CrossCloseButton);
