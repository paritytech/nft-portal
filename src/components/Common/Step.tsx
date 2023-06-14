import { ReactElement, memo } from 'react';
import { styled } from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces.ts';
import { CssFontSemiBoldS } from '@helpers/reusableStyles.ts';

const SStep = styled.div`
  ${CssFontSemiBoldS}
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.textAndIconsSecondary};
  padding: 6px 16px 6px 6px;
  border: 1px solid ${({ theme }) => theme.appliedStroke};
  border-radius: 48px;

  &.active {
    color: ${({ theme }) => theme.textAndIconsPrimary};
  }

  &.disabled {
    color: ${({ theme }) => theme.textAndIconsDisabled};
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 24px;
  }

  .counter {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    background-color: ${({ theme }) => theme.fill6};
    border-radius: 32px;
  }
`;

interface StepProps extends CommonStyleProps {
  counter: string;
  children: ReactElement | ReactElement[] | string;
}

const Step = ({ counter, children, className }: StepProps) => {
  return (
    <SStep className={className}>
      <div className='counter'>{counter}</div>
      {children}
    </SStep>
  );
};

export default memo(Step);
