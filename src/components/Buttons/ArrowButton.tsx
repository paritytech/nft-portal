import { FormEvent, ReactElement, memo } from 'react';
import { styled } from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces.ts';
import { handleActionClick } from '@helpers/utilities.ts';

import ArrowIcon from '@images/icons/arrow.svg';

const SArrowButton = styled.button<CommonStyleProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 64px;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.forcedWhite};
  border: 1px solid ${({ theme }) => theme.appliedStroke};
  border-radius: 12px;

  .arrow {
    width: 14px;
    height: 14px;

    path {
      fill: ${({ theme }) => theme.textAndIconsTertiary};
    }
  }

  span {
    color: ${({ theme, disabled }) => (disabled ? theme.textAndIconsDisabled : theme.textAndIconsPrimary)};
  }

  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ theme }) => theme.fill6};
  }
`;

interface ArrowIconProps extends CommonStyleProps {
  children: ReactElement | ReactElement[] | string;
  action?: () => void;
}

const ArrowButton = ({ children, action, className, disabled }: ArrowIconProps) => (
  <SArrowButton
    className={className}
    disabled={disabled}
    onClick={(event: FormEvent) => handleActionClick(event, disabled, action)}
  >
    {children}
    <ArrowIcon className='arrow' />
  </SArrowButton>
);

export default memo(ArrowButton);
