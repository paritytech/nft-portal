import { memo } from 'react';
import styled from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces';
import { styleSettings } from '@helpers/config';

const SButton = styled.button<CommonStyleProps>`
  line-height: 50px;
  padding: 0 50px;
  color: ${styleSettings.colors.white};
  background-color: ${styleSettings.colors.cerise};
  font-size: 20px;
  border-radius: 10px;
  border: 0;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;

interface ActionButtonProps extends CommonStyleProps {
  children: any;
  action: () => void;
}

const ActionButton = ({ children, action, className, isDisabled }: ActionButtonProps) => {
  const handleClick = () => {
    if (isDisabled) {
      return;
    }

    action();
  };

  return (
    <SButton className={className} isDisabled={isDisabled} onClick={handleClick}>
      {children}
    </SButton>
  );
};

export default memo(ActionButton);
