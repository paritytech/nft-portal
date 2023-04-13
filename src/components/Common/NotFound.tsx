import { memo } from 'react';

// TODO: tell designer to create a 404 template
const NotFound = () => {
  return <div style={{ textAlign: 'center', paddingTop: '50px' }}>Page not found</div>;
};

export default memo(NotFound);
