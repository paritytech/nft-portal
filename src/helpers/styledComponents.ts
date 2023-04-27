// Styled components are separated from reusableStyles to prevent circular dependencies
import { FormGroup, FormLabel } from 'react-bootstrap';
import Card from 'react-bootstrap/esm/Card';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

import { CssFormControl } from './reusableStyles';

export const SCard = styled(Card)`
  max-width: 364px;
  background-color: ${({ theme }) => theme.fill6};
  padding: 8px;
  border-radius: 16px;
`;

export const SCardEdit = styled(Card.Subtitle)`
  display: flex;
  justify-content: space-between;

  a {
    position: relative;
    padding-right: 6px;
    color: ${({ theme }) => theme.textAndIconsPrimary};
    text-decoration: none;

    :hover {
      text-decoration: underline;
    }

    svg {
      width: 15px;
      position: absolute;
      top: -2px;
      right: -12px;
    }
  }
`;

export const SModal = styled(Modal)`
  .modal-content {
    border-radius: 16px;
    background-color: ${({ theme }) => theme.backgroundTertiary};
    border: 1px solid ${({ theme }) => theme.appliedStroke};
  }

  .modal-header {
    padding: 24px 24px 32px;
  }

  .modal-body {
    padding: 0 24px 24px;
  }
`;

export const SGroup = styled(FormGroup)`
  margin-bottom: 32px;

  input[type='text'],
  input[type='number'] {
    height: 56px;
    padding: 0;
    border-radius: 32px;

    ${CssFormControl}
  }

  textarea {
    width: 100%;
    height: 128px;
    padding: 16px 0;
    border-radius: 16px;
    resize: none;

    ${CssFormControl}

    :hover {
      padding-top: 12px;
    }

    :focus {
      padding-top: 14px;
    }

    :hover:disabled {
      padding-top: 16px;
    }
  }
`;

export const SLabel = styled(FormLabel)`
  color: ${({ theme }) => theme.textAndIconsSecondary};
  margin-bottom: 12px;

  &.bigger-margin {
    margin-bottom: 24px;
  }
`;
