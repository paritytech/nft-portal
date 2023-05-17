import { ReactElement, memo } from 'react';
import { styled } from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces.ts';
import { CssFontRegularL } from '@helpers/reusableStyles.ts';

const SStep = styled.div`
  ${CssFontRegularL}
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.textAndIconsSecondary};
  padding: 8px 24px 8px 8px;
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
    width: 44px;
    height: 45px;
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
