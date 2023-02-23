import Card from 'react-bootstrap/esm/Card';
import Modal from 'react-bootstrap/esm/Modal';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';
import BasicButton from '@buttons/BasicButton';

import { ThemeStyle, Themeable } from './interfaces';
import { ButtonMini, styleSettings } from './reusableStyles';

export const SActionButtonMini = styled(ActionButton)`
  ${ButtonMini}
`;

export const SBasicButtonMini = styled(BasicButton)`
  ${ButtonMini}
`;

export const SSecondaryButton = styled(BasicButton)<Themeable>`
  color: ${({ activeTheme }) => activeTheme.menuButtonTextColor};
  background-color: ${({ activeTheme }) => activeTheme.menuButtonBackgroundColor};

  :hover {
    background-color: ${({ activeTheme }) => activeTheme.menuButtonActiveBackgroundColor};
  }

  a {
    color: ${({ activeTheme }) => activeTheme.menuButtonTextColor};
  }
`;

export const SCard = styled(Card)`
  background-color: ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.bodyBackground};
  border: 2px solid ${({ activetheme }: { activetheme: ThemeStyle }) => activetheme.menuButtonBorderColor};

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
      border-bottom: 1px solid ${({ activetheme: activeTheme }: { activetheme: ThemeStyle }) => activeTheme.buttonBorderColor};
    }
  }
`;
