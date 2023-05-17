import { ChangeEvent, memo } from 'react';
import { styled } from 'styled-components';

import { CommonStyleProps } from '@helpers/interfaces.ts';
import { CssInclusivelyHidden } from '@helpers/reusableStyles.ts';

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

interface RadioProps extends CommonStyleProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedValue: string;
}

const Radio = ({ name, label, value, onChange, selectedValue, required }: RadioProps) => (
  <SLabel>
    <SRadio
      type='radio'
      onChange={onChange}
      name={name}
      value={value}
      checked={selectedValue === value}
      required={required}
    />
    {selectedValue === value ? <ActiveRadio /> : <EmptyRadio />}
    <span>{label}</span>
  </SLabel>
);

export default memo(Radio);
