import { useCallback, useState } from 'react';

export const useCopyToClipboard = (
  copyTarget: string,
  initialText: string,
  activeText: string = initialText,
): [() => void, string] => {
  const [text, setText] = useState<string>(initialText);

  const copyToClipboard = useCallback(() => {
    if (copyTarget) {
      navigator.clipboard.writeText(copyTarget);
      setText(activeText);
      setTimeout(() => {
        setText(initialText);
      }, 1000);
    }
  }, [activeText, copyTarget, initialText]);

  return [copyToClipboard, text];
};
