// Styled components are separated from reusableStyles to prevent circular dependencies
// for example BasicButton uses import { CssCommonButtonStyles } from '@helpers/reusableStyles';
// if we put SActionButtonMini inside of reusableStyles, we will have a circular dependency

import Card from 'react-bootstrap/esm/Card';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';
import BasicButton from '@buttons/BasicButton';

import { ThemeStyle, Themeable } from './interfaces';
import { CssButtonMini, styleSettings } from './reusableStyles';

export const SActionButtonMini = styled(ActionButton)`
  ${CssButtonMini}
`;

export const SBasicButtonMini = styled(BasicButton)`
  ${CssButtonMini}
`;

export const SSecondaryButton = styled(BasicButton)<Themeable>`
  color: ${({ activeTheme }) => activeTheme.navigationButtonTextColor};
  background-color: ${({ activeTheme }) => activeTheme.navigationButtonBackgroundColor};

  :hover {
    background-color: ${({ activeTheme }) => activeTheme.navigationButtonActiveBackgroundColor};
  }

  a {
    color: ${({ activeTheme }) => activeTheme.navigationButtonTextColor};
  }
`;

export const SCard = styled(Card)`
  background-color: ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.bodyBackground};
  border: 2px solid ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.navigationButtonBorderColor};

  .card-footer {
    background-color: inherit;
    border-top: 1px solid ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.buttonBorderColor};
  }
`;

export const SCardEdit = styled(Card.Subtitle)`
  display: flex;
  justify-content: space-between;

  a {
    position: relative;
    padding-right: 6px;
    color: ${styleSettings.colors.cerise};
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
  .modal-content,
  select {
    background-color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.bodyBackground};
    color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.defaultTextColor};
    border: 2px solid ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.buttonBorderColor};

    .modal-header {
      border-bottom: 1px solid
        ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.buttonBorderColor};
    }
  }
`;
