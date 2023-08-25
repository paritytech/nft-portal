import { StatusMessages } from './config.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleError = (error: any) => {
  if (error.toString() === 'Error: Cancelled') {
    return StatusMessages.TRANSACTION_CANCELED;
  }

  return StatusMessages.ACTION_FAILED;
};
