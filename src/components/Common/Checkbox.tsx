import { forwardRef, memo, useState } from 'react';
import styled from 'styled-components';

import { CssInclusivelyHidden } from '@helpers/reusableStyles';

import ActiveCheckbox from '@images/icons/active-checkbox.svg';
import EmptyCheckbox from '@images/icons/empty-checkbox.svg';

const SLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const SCheckbox = styled.input`
  ${CssInclusivelyHidden}
`;

interface CheckboxProps {
  label: string;
  defaultChecked?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const { label, defaultChecked = false } = props;
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked);

  return (
    <SLabel>
      <SCheckbox
        type='checkbox'
        ref={ref}
        onChange={() => {
          setIsChecked(!isChecked);
        }}
        defaultChecked={defaultChecked}
      />
      {isChecked ? <ActiveCheckbox /> : <EmptyCheckbox />}
      <span>{label}</span>
    </SLabel>
  );
});

export default memo(Checkbox);
