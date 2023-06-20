import { ReactElement, memo } from 'react';
import { styled } from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces.ts';
import { CssFontBoldL, CssFontBoldXL, CssFontBoldXXL, mediaQueries } from '@helpers/reusableStyles.ts';

const STitle = styled.div`
  &.main {
    ${CssFontBoldL}
    margin-bottom: 30px;

    @media ${mediaQueries.tablet} {
      ${CssFontBoldXXL}
    }
  }

  &.secondary {
    ${CssFontBoldXL}
  }
`;

interface TitleProps extends CommonStyleProps {
  children: ReactElement | ReactElement[] | string;
}

const Title = ({ children, className }: TitleProps) => {
  return <STitle className={className}>{children}</STitle>;
};

export default memo(Title);
