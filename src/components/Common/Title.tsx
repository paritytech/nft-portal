import { ReactElement, memo } from 'react';
import styled from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces';
import { CssFontBoldL, CssFontBoldM, CssFontBoldXL, CssFontBoldXXL } from '@helpers/reusableStyles';

const STitle = styled.div`
  &.XXL {
    ${CssFontBoldXXL}
    margin-bottom: 30px;
  }

  &.XL {
    ${CssFontBoldXL}
  }

  &.L {
    ${CssFontBoldL}
  }

  &.M {
    ${CssFontBoldM}
  }
`;

interface TitleProps extends CommonStyleProps {
  children: ReactElement | ReactElement[] | string;
}

const Title = ({ children, className }: TitleProps) => {
  return <STitle className={className}>{children}</STitle>;
};

export default memo(Title);
