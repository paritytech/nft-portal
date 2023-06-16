import { FormEvent, ReactElement, memo } from 'react';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { CommonStyleProps } from '@helpers/interfaces.ts';
import { CssFontRegularL } from '@helpers/reusableStyles.ts';
import { handleActionClick } from '@helpers/utilities.ts';

import ArrowIcon from '@images/icons/arrow.svg';

const SIconArrowButton = styled.button<CommonStyleProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: 8px 16px 8px 8px;
  color: ${({ theme, isDisabled }) => (isDisabled ? theme.appliedLightPinkBackground : theme.accentsPink)};
  background-color: ${({ theme }) => theme.appliedLightPinkBackground};
  border: 0;
  border-radius: 48px;
  box-sizing: border-box;

  &:hover,
  &:active {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    padding: ${({ isDisabled }) => (isDisabled ? '8px 16px 8px 8px' : '8px 14px 8px 6px')};
    border: ${({ theme, isDisabled }) => (isDisabled ? 0 : `2px solid ${theme.accentsPink}`)};
  }

  img {
    width: 48px;
    height: 48px;
    border-radius: 32px;
  }

  .arrow {
    width: 24px;
    height: 24px;

    path {
      fill: ${({ theme }) => theme.textAndIconsDisabled};
    }
  }
`;

const SContent = styled.div`
  ${CssFontRegularL}
  display: flex;
  align-items: center;
  gap: 12px;

  span:first-child {
    padding-left: 16px;
  }
`;

interface ArrowIconProps extends CommonStyleProps {
  children: ReactElement | ReactElement[] | string;
  imageCid?: string;
  action?: () => void;
}

const IconArrowButton = ({ children, imageCid, action, className, isDisabled }: ArrowIconProps) => (
  <SIconArrowButton
    className={className}
    isDisabled={isDisabled}
    onClick={(event: FormEvent) => handleActionClick(event, isDisabled, action)}
  >
    <SContent>
      {imageCid && <ShowImage imageCid={imageCid} altText='' />}
      <span>{children}</span>
    </SContent>

    <ArrowIcon className='arrow' />
  </SIconArrowButton>
);

export default memo(IconArrowButton);
