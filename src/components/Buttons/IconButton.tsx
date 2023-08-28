import { ReactElement, memo } from 'react';
import { styled } from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces.ts';

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

    path {
      fill: ${({ theme }) => theme.forcedBlack};
    }
  }

  &:hover,
  &.active {
    background-color: ${({ theme }) => theme.fill12};
  }

  &.no-bg:not(:hover) {
    background-color: transparent;
  }
`;

interface IconButtonProps extends CommonStyleProps {
  icon: ReactElement;
  action?: (event: React.MouseEvent<HTMLElement>) => void;
}

const IconButton = ({ icon, action, className, title }: IconButtonProps) => (
  <SIconButton className={className} onClick={action} title={title}>
    {icon}
  </SIconButton>
);

export default memo(IconButton);
