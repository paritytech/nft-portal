import { memo } from 'react';
import { Link } from 'react-router-dom';

import { routes } from '@helpers/routes';

const MyPools = () => {
  return <Link to={routes.myAssets.createPool}>Create pool</Link>;
};

export default memo(MyPools);
