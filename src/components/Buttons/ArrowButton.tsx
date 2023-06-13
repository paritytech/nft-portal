import { FormEvent, ReactElement, memo } from 'react';
import { styled } from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces.ts';

import ArrowIcon from '@images/icons/arrow.svg';

const SArrowButton = styled.button<CommonStyleProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 64px;
  padding: 0 12px;
  background-color: ${({ theme }) => theme.forcedWhite};
  border: 1px solid ${({ theme }) => theme.appliedStroke};
  border-radius: 12px;

  .arrow {
    width: 24px;
    height: 24px;

    path {
      fill: ${({ theme }) => theme.textAndIconsTertiary};
    }
  }

  span {
    color: ${({ theme, isDisabled }) => (isDisabled ? theme.textAndIconsDisabled : theme.textAndIconsPrimary)};
  }

  &:hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ theme }) => theme.fill6};
  }
`;

interface ArrowIconProps extends CommonStyleProps {
  children: ReactElement | ReactElement[] | string;
  action?: () => void;
}

const ArrowButton = ({ children, action, className, isDisabled }: ArrowIconProps) => {
  const handleClick = (event: FormEvent) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    if (typeof action !== 'undefined') {
      event.preventDefault();
      action();
    }
  };

  return (
    <SArrowButton onClick={handleClick} className={className} isDisabled={isDisabled}>
      {children}
      <ArrowIcon className='arrow' />
    </SArrowButton>
  );
};

export default memo(ArrowButton);
