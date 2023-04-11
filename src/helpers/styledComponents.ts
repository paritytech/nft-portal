// Styled components are separated from reusableStyles to prevent circular dependencies
// for example BasicButton uses import { CssCommonButtonStyles } from '@helpers/reusableStyles';
// if we put SActionButtonMini inside of reusableStyles, we will have a circular dependency
import Card from 'react-bootstrap/esm/Card';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';
import BasicButton from '@buttons/BasicButton';

import { ThemeStyle, Themeable } from './interfaces';
import { CssButtonMini, CssButtonXMini, styleSettings } from './reusableStyles';

export const SActionButtonMini = styled(ActionButton)`
  ${CssButtonMini}
`;

export const SActionButtonXMini = styled(ActionButton)`
  ${CssButtonXMini}
`;

export const SBasicButtonMini = styled(BasicButton)`
  ${CssButtonMini}
`;

export const SSecondaryButton = styled(BasicButton)<Themeable>`
  color: ${({ activeTheme }) => activeTheme.buttonSecondaryText};
  background-color: ${({ activeTheme }) => activeTheme.buttonSecondaryBackground};

  :hover {
    color: ${({ activeTheme }) => activeTheme.buttonSecondaryText};
    background-color: ${({ activeTheme }) => activeTheme.buttonSecondaryBackgroundHovered};
  }

  a {
    color: ${({ activeTheme }) => activeTheme.buttonSecondaryText};
  }
`;

export const SCard = styled(Card)`
  background-color: ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.fill6};
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
  .modal-content {
    background-color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.backgroundTertiary};
    border: 1px solid ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.appliedStroke};
  }

  select {
    background-color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) =>
      activeTheme.buttonMainBackground};
    color: ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.buttonMainText};
  }
`;
