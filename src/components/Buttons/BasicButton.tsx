import { memo } from 'react';
import styled from 'styled-components';

import { useAccounts } from '@contexts/AccountContext';

import { styleSettings } from '@helpers/config';
import { CommonStyleProps } from '@helpers/interfaces';

const SButton = styled.button<CommonStyleProps>`
  line-height: 50px;
  padding: 0 50px;
  color: ${styleSettings.colors.white};
  background-color: ${styleSettings.colors.cerise};
  font-size: 20px;
  border-radius: 10px;
  border: 0;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  }

  a {
    text-decoration: none;
    color: ${styleSettings.colors.white};
  }
`;

interface BasicButtonProps extends CommonStyleProps {
  children: any;
}

const BasicButton = ({ children, type, className, isDisabled }: BasicButtonProps) => {
  const { theme } = useAccounts();

  return (
    <SButton type={type} className={className} isDisabled={isDisabled} activeTheme={theme}>
      {children}
    </SButton>
  );
};

export default memo(BasicButton);
