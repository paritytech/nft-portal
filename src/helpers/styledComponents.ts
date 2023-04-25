// Styled components are separated from reusableStyles to prevent circular dependencies
import { FormControl } from 'react-bootstrap';
import Card from 'react-bootstrap/esm/Card';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

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

export const SInput = styled(FormControl)`
  height: 56px;
  background-color: ${({ theme }) => theme.fill6};
  color: ${({ theme }) => theme.textAndIconsPrimary};
  border-radius: 32px;
  border: 0;
  box-sizing: border-box;
  text-indent: 24px;
  transition: none;

  :hover {
    border: 4px solid ${({ theme }) => theme.fill12};
    text-indent: 20px;
  }

  :focus {
    background-color: ${({ theme }) => theme.fill6};
    color: ${({ theme }) => theme.textAndIconsPrimary};
    border: 2px solid ${({ theme }) => theme.textAndIconsPrimary};
    text-indent: 22px;
  }

  :disabled {
    background: none;
    border: 1px solid ${({ theme }) => theme.fill12};
    text-indent: 23px;
    cursor: not-allowed;
  }
`;
