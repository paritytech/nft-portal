import { forwardRef, memo, useState } from 'react';
import styled from 'styled-components';

import ActiveCheckbox from '@images/icons/active-checkbox.svg';
import EmptyCheckbox from '@images/icons/empty-checkbox.svg';

const SLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SCheckbox = styled.input`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
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
