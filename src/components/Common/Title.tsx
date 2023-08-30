import { ReactElement, memo } from 'react';
import { styled } from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces.ts';
import { CssFontBoldL, CssFontBoldXL, CssFontBoldXXL, mediaQueries } from '@helpers/reusableStyles.ts';

const STitle = styled.div`
  &.main,
  a {
    ${CssFontBoldL}

    @media ${mediaQueries.tablet} {
      ${CssFontBoldXXL}
    }
  }

  &.main {
    margin-bottom: 30px;
  }

  &.secondary {
    ${CssFontBoldXL}
  }

  a {
    color: ${({ theme }) => theme.textAndIconsPrimary};
    text-decoration: none;
  }
`;

interface TitleProps extends CommonStyleProps {
  children: ReactElement | ReactElement[] | string;
}

const Title = ({ children, className }: TitleProps) => {
  return <STitle className={className}>{children}</STitle>;
};

export default memo(Title);
