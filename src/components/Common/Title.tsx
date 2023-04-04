import { memo } from "react";
import styled from "styled-components"

const STitle = styled.h1`
  font-family: 'Unbounded', cursive;
  font-size: 40px;
`;

interface TitleProps {
  children: any;
}


const Title = ({ children }: TitleProps) => {


  return (
    <STitle>{children}</STitle>
  )
}

export default memo(Title);
