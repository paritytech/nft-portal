import { ReactElement, memo } from 'react';
import { styled } from 'styled-components';

import ShowImage from '@common/ShowImage.tsx';

import { CommonStyleProps } from '@helpers/interfaces.ts';
import { CssFontRegularL } from '@helpers/reusableStyles.ts';

import ArrowIcon from '@images/icons/arrow.svg';

const SIconArrowButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 72px;
  padding: 8px 14px 8px 8px;
  color: ${({ theme }) => theme.textAndIconsPrimary};
  background-color: ${({ theme }) => theme.fill10};
  border: 0;
  border-radius: 48px;
  box-shadow: 0 0 0 4px ${({ theme }) => theme.fill6};

  img {
    width: 56px;
    height: 56px;
    border-radius: 32px;
  }

  .arrow {
    width: 40px;
    height: 40px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.fill12};
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

const IconArrowButton = ({ children, imageCid, action, className }: ArrowIconProps) => (
  <SIconArrowButton onClick={action} className={className}>
    <SContent>
      {imageCid && <ShowImage imageCid={imageCid} altText='' />}
      <span>{children}</span>
    </SContent>

    <ArrowIcon className='arrow' />
  </SIconArrowButton>
);

export default memo(IconArrowButton);
