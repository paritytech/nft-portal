import Card from 'react-bootstrap/Card';
import styled from 'styled-components';

import ActionButton from '@buttons/ActionButton';
import BasicButton from '@buttons/BasicButton';

import { ButtonMini, styleSettings } from './reusableStyles';

export const SActionButtonMini = styled(ActionButton)`
  ${ButtonMini}
`;

export const SBasicButtonMini = styled(BasicButton)`
  ${ButtonMini}
`;

export const SSecondaryButton = styled(BasicButton)`
  color: ${styleSettings.colors.shark};
  background-color: ${styleSettings.colors.alto};

  a {
    color: ${styleSettings.colors.shark};
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
