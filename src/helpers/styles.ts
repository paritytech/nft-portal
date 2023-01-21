import Card from 'react-bootstrap/Card';
import styled, { css } from 'styled-components';

import ActionButton from '@buttons/ActionButton';
import BasicButton from '@buttons/BasicButton';

import { styleSettings } from './config';

export const SContentBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px dashed ${styleSettings.colors.cerise};
`;

export const SContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 250px;
  word-break: break-word;
  align-items: center;
`;

const ButtonMini = css`
  line-height: 30px;
  padding: 0 25px;
`;

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
