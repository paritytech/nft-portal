import { StatusMessages } from './constants';

export const handleError = (error: any) => {
  if (error.toString() === 'Error: Cancelled') {
    return StatusMessages.TRANSACTION_CANCELED;
  }

  return StatusMessages.ACTION_FAILED;
};
