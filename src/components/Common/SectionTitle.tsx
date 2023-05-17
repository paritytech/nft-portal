import { ReactElement, memo } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

import ActionButton from '@buttons/ActionButton.tsx';

const SSectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface SectionTitleProps {
  title: ReactElement;
  route: string;
}

const SectionTitle = ({ title, route }: SectionTitleProps) => {
  return (
    <SSectionTitle>
      {title}
      <Link to={route}>
        <ActionButton className='transparent S padding32'>Show all</ActionButton>
      </Link>
    </SSectionTitle>
  );
};

export default memo(SectionTitle);
