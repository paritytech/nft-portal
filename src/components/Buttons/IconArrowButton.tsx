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
  color: ${({ theme, disabled }) => (disabled ? theme.appliedLightPinkBackground : theme.accentsPink)};
  background-color: ${({ theme }) => theme.appliedLightPinkBackground};
  border: 0;
  border-radius: 48px;
  box-sizing: border-box;

  &:hover,
  &:active {
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    padding: ${({ disabled }) => (disabled ? '8px 16px 8px 8px' : '8px 14px 8px 6px')};
    border: ${({ theme, disabled }) => (disabled ? 0 : `2px solid ${theme.accentsPink}`)};
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

const IconArrowButton = ({ children, imageCid, action, className, disabled }: ArrowIconProps) => (
  <SIconArrowButton
    className={className}
    disabled={disabled}
    onClick={(event: FormEvent) => handleActionClick(event, disabled, action)}
  >
    <SContent>
      {imageCid && <ShowImage imageCid={imageCid} altText='' />}
      <span>{children}</span>
    </SContent>

    <ArrowIcon className='arrow' />
  </SIconArrowButton>
);

export default memo(IconArrowButton);
