import styled, { css } from 'styled-components';

import { CommonStyleProps, ThemeStyle, Themeable } from './interfaces';

export const deviceScreenSize = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
};

export const styleSettings = {
  colors: {
    alto: '#D9D9D9',
    aqua: '#00FFE1',
    black: '#000000',
    blackHaze: '#f4f5f5',
    cerise: '#D33079',
    gallery: '#EEEEEE',
    jaffa: '#F19135',
    rose: '#E6007A',
    shark: '#212529',
    white: '#FFFFFF',
  },
  mediaQueries: {
    mobile: `(min-width: ${deviceScreenSize.mobile})`,
    tablet: `(min-width: ${deviceScreenSize.tablet})`,
    desktop: `(min-width: ${deviceScreenSize.desktop})`,
  },
  sizes: {
    largeText: '36px',
    majorText: '30px',
    emphasizedText: '20px',
    mediumText: '16px',
    smallText: '12px',
  },
};

export const themes: Record<string, ThemeStyle> = {
  kusama: {
    bodyBackground: styleSettings.colors.black,
    borderRadius: '0',
    buttonBackgroundColor: 'transparent',
    buttonBorder: `2px solid ${styleSettings.colors.rose}`,
    buttonBorderColorHover: styleSettings.colors.aqua,
    buttonTextColor: styleSettings.colors.rose,
    buttonTextColorHover: styleSettings.colors.aqua,
    defaultTextColor: styleSettings.colors.white,
    logoTextColor: styleSettings.colors.white,
  },
  polkadot: {
    bodyBackground: styleSettings.colors.blackHaze,
    borderRadius: '10px',
    buttonBackgroundColor: styleSettings.colors.cerise,
    buttonBorder: '0',
    buttonBorderColorHover: styleSettings.colors.cerise,
    buttonTextColor: styleSettings.colors.white,
    buttonTextColorHover: styleSettings.colors.white,
    defaultTextColor: styleSettings.colors.shark,
    logoTextColor: styleSettings.colors.black,
  },
};

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

export const ButtonMini = css`
  line-height: 30px;
  padding: 0 25px;
`;

export const CommonButtonStyles = css<CommonStyleProps & Themeable>`
  height: 50px;
  padding: 0 50px;
  color: ${({ activeTheme }) => activeTheme.buttonTextColor};
  background-color: ${({ activeTheme }) => activeTheme.buttonBackgroundColor};
  font-size: 20px;
  border-radius: ${({ activeTheme }) => activeTheme.borderRadius};
  border: ${({ activeTheme }) => activeTheme.buttonBorder};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
  box-sizing: border-box;

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    border-color: ${({ activeTheme }) => activeTheme.buttonBorderColorHover};
    color: ${({ activeTheme }) => activeTheme.buttonTextColorHover};
  }

  a {
    text-decoration: none;
    color: ${styleSettings.colors.white};
  }
`;
