import { ReactElement, memo } from 'react';
import styled from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces';
import { CssBoldL, CssBoldM, CssBoldXL, CssBoldXXL } from '@helpers/reusableStyles';

const STitle = styled.div`
  &.XXL {
    ${CssBoldXXL}
    margin-bottom: 30px;
  }

  &.XL {
    ${CssBoldXL}
  }

  &.L {
    ${CssBoldL}
  }

  &.M {
    ${CssBoldM}
  }
`;

interface TitleProps extends CommonStyleProps {
  children: ReactElement | ReactElement[] | string;
}

const Title = ({ children, className }: TitleProps) => {
  return <STitle className={className}>{children}</STitle>;
};

export default memo(Title);
