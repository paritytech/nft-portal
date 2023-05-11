import { westend } from '@capi/westend';
import { memo, useCallback } from 'react';

// import { polkadotDev } from './nets';

const Capi = () => {
  const accounts = useCallback(async () => {
    const time = westend.Timestamp.Now;

    console.log(time);
  }, []);

  return (
    <div>
      <h1>This is Capi</h1>
      <button onClick={accounts}>Capi</button>
    </div>
  );
};

export default memo(Capi);
