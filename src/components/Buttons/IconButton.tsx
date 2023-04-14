import { ReactElement, memo } from 'react';
import styled from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces';

const SIconButton = styled.button`
  background-color: ${({ theme }) => theme.fill6};
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
  action: (event: React.MouseEvent<HTMLElement>) => void;
}

const IconButton = ({ icon, action, className }: IconButtonProps) => (
  <SIconButton className={className} onClick={action}>
    {icon}
  </SIconButton>
);

export default memo(IconButton);
