import { local } from '@capi/localhost';
import { ss58 } from 'capi';
import { memo, useCallback } from 'react';

const Nfts = () => {
  const checkBalance = useCallback(async () => {
    const addr = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice dev acc
    const addressPubKey = ss58.decode(addr)[1];
    const balance = await local.System.Account.value(addressPubKey).run();
    console.log(balance.data.free);
    console.log(local.System.Version.implName);
  }, []);

  return (
    <div>
      <h1>This is Capi</h1>
      <button onClick={checkBalance}>Capi</button>
    </div>
  );
};

export default memo(Nfts);
