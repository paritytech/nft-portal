import styled from 'styled-components';
import ActionButton from '@buttons/ActionButton';

export const SContentBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
`;

export const SContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 250px;
  word-break: break-word;
`;

export const SActionButtonMini = styled(ActionButton)`
  line-height: 30px;
  padding: 0 25px;
`;
