// Styled components are separated from reusableStyles to prevent circular dependencies
import { Card, Form, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import { styled } from 'styled-components';

import { CssFontRegularS, CssFontSemiBoldL, CssFormControl, mediaQueries } from './reusableStyles.ts';

export const SCard = styled(Card)`
  width: 360px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.appliedSeparator};
  border-radius: 16px;

  @media ${mediaQueries.tablet} {
    width: 330px;
  }

  @media ${mediaQueries.laptop} {
    width: 360px;
  }
`;

export const SLinkCard = styled(SCard)`
  cursor: pointer;

  .card-img {
    border-radius: 12px;
  }

  .card-title {
    ${CssFontSemiBoldL}
  }

  .card-text {
    ${CssFontRegularS}
    color: ${({ theme }) => theme.textAndIconsTertiary}
  }
`;

export const SModal = styled(Modal)`
  z-index: 2;

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

export const SFormLayout = styled(Form)`
  display: flex;
  gap: 56px;

  aside {
    min-width: 300px;
    width: 300px;
  }

  section {
    flex-grow: 1;
  }
`;

export const SGroup = styled(FormGroup)`
  margin-bottom: 24px;

  input[type='text'],
  input[type='number'] {
    height: 48px;
    padding: 0 12px;

    ${CssFormControl}
  }

  textarea {
    width: 100%;
    height: 128px;
    padding: 12px;
    resize: none;

    ${CssFormControl}

    &:hover {
      padding-top: 11px;
    }

    &:focus {
      padding-top: 11px;
    }

    &:hover:disabled {
      padding-top: 12px;
    }
  }
`;

export const SLabel = styled(FormLabel)`
  color: ${({ theme }) => theme.textAndIconsPrimary};
  margin-bottom: 10px;

  &.bigger-margin {
    margin-bottom: 24px;
  }
`;

export const SImageSelection = styled(SGroup)`
  display: block;

  @media ${mediaQueries.tablet} {
    display: none;
  }
`;
