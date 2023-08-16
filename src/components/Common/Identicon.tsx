import { toSvg } from 'jdenticon';
import { memo } from 'react';

interface IdenticonProps {
  data: string;
  size?: number;
}

const Identicon = ({ data, size = 32 }: IdenticonProps) => {
  const dataUri = `url("data:image/svg+xml, ${encodeURIComponent(toSvg(data, size))}")`;

  return (
    <div
      style={{
        background: dataUri,
        width: size,
        height: size,
      }}
    />
  );
};

export default memo(Identicon);
