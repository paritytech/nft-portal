import { ChangeEvent, memo } from 'react';
import styled from 'styled-components';

import { CssInclusivelyHidden } from '@helpers/reusableStyles';

import ActiveRadio from '@images/icons/active-radio.svg';
import EmptyRadio from '@images/icons/empty-radio.svg';

const SLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const SRadio = styled.input`
  ${CssInclusivelyHidden}
`;

interface RadioProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedValue: string;
}

const Radio = ({ name, label, value, onChange, selectedValue }: RadioProps) => (
  <SLabel>
    <SRadio type='radio' onChange={onChange} name={name} value={value} checked={selectedValue === value} />
    {selectedValue === value ? <ActiveRadio /> : <EmptyRadio />}
    <span>{label}</span>
  </SLabel>
);

export default memo(Radio);
