import styled from 'styled-components';

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

export const SActionButtonMini = styled(ActionButton)`
  line-height: 30px;
  padding: 0 25px;
`;

export const SSecondaryButton = styled(BasicButton)`
  color: ${styleSettings.colors.shark};
  background-color: ${styleSettings.colors.alto};

  a {
    color: ${styleSettings.colors.shark};
  }
`;
