import { memo } from 'react';
import { Link } from 'react-router-dom';

import { routes } from '@helpers/routes';

const MyAssets = () => {
  return (
    <>
      <section>
        <h4>
          <Link to={routes.myAssets.collections}>My collections</Link>
        </h4>
      </section>
      <section>
        <h4>
          <Link to={routes.myAssets.pools}>My liquidity pools</Link>
        </h4>
      </section>
    </>
  );
};

export default memo(MyAssets);
