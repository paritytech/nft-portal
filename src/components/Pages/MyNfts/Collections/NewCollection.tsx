import { FormEvent, memo, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { Link } from 'react-router-dom';

import BasicButton from '@buttons/BasicButton';

import ModalStatus from '@common/ModalStatus';

import { useAccounts } from '@contexts/AccountsContext';

import { routes } from '@helpers/routes';
import { SSecondaryButton } from '@helpers/styledComponents';

import { useCollections } from '@hooks/useCollections';

const NewCollection = () => {
  const { theme } = useAccounts();
  const { mintCollection } = useCollections();

  const submitMintCollection = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      // TODO prepare form data

      mintCollection();
    },
    [mintCollection],
  );

  return (
    <>
      <ModalStatus />
      <Form onSubmit={submitMintCollection}>
        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <BasicButton type='submit'>Mint collection</BasicButton>
          <Link to={routes.collections}>
            <SSecondaryButton type='button' activeTheme={theme}>
              Back
            </SSecondaryButton>
          </Link>
        </Stack>
      </Form>
    </>
  );
};

export default memo(NewCollection);
