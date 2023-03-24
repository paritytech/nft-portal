import { memo } from 'react';
import { Link } from 'react-router-dom';

import { routes } from '@helpers/routes';

const Discover = () => {
  return (
    <>
      <section>
        <h4>
          <Link to={routes.discover.tokens}>Tokens</Link>
        </h4>
      </section>
      <section>
        <h4>
          <Link to={routes.discover.pools}>Pools</Link>
        </h4>
      </section>
    </>
  );
};

export default memo(Discover);
