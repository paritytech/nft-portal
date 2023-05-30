import { ReactElement, memo } from 'react';
import { styled } from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces.ts';

import ArrowIcon from '@images/icons/arrow.svg';

const SArrowButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 56px;
  padding: 0 12px;
  background-color: ${({ theme }) => theme.fill6};
  border: 0;
  border-radius: 12px;

  .arrow {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.fill12};
  }
`;

interface ArrowIconProps extends CommonStyleProps {
  children: ReactElement | ReactElement[] | string;
  action?: () => void;
}

const ArrowButton = ({ children, action, className }: ArrowIconProps) => (
  <SArrowButton onClick={action} className={className}>
    {children}
    <ArrowIcon className='arrow' />
  </SArrowButton>
);

export default memo(ArrowButton);
