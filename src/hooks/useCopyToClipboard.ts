import { useCallback, useState } from 'react';

// the value can be used as some contextual text or a class name
export const useCopyToClipboard = (
  copyTarget: string,
  initialValue: string,
  activeValue: string = initialValue,
  timeout = 1000,
): [() => void, string] => {
  const [value, setValue] = useState<string>(initialValue);

  const copyToClipboard = useCallback(() => {
    if (copyTarget) {
      navigator.clipboard.writeText(copyTarget);
      setValue(activeValue);
      setTimeout(() => {
        setValue(initialValue);
      }, timeout);
    }
  }, [activeValue, copyTarget, initialValue, timeout]);

  return [copyToClipboard, value];
};
