import { memo } from 'react';

import { RestrictionTypes } from '@helpers/config.ts';
import { RestrictionMessage } from '@helpers/interfaces.ts';

interface ShowRestrictionMessageProps {
  restrictionsMessages: RestrictionMessage[];
  restrictionType: RestrictionTypes;
}

const ShowRestrictionMessage = ({ restrictionsMessages, restrictionType }: ShowRestrictionMessageProps) => {
  const foundRestriction = restrictionsMessages.find(({ type }) => type === restrictionType);

  if (foundRestriction) {
    return <p className='text-danger mt-1'>{foundRestriction.message}</p>;
  }

  return null;
};

export default memo(ShowRestrictionMessage);
