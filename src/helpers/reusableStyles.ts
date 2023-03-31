import styled, { css } from 'styled-components';

import { ChainThemes } from './constants';
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
    blackHaze: '#F4F5F5',
    cerise: '#D33079',
    gallery: '#EEEEEE',
    jaffa: '#F19135',
    rose: '#E6007A',
    shark: '#2C2C30',
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

// TODO refactor the whole color scheme, once the figma design is finished
export const themes: Record<ChainThemes, ThemeStyle> = {
  [ChainThemes.KUSAMA]: {
    blockBackgroundColorHover: styleSettings.colors.rose,
    bodyBackground: styleSettings.colors.black,
    borderRadius: '0',
    buttonBackgroundColor: 'transparent',
    buttonBorderColor: styleSettings.colors.rose,
    buttonBorderColorHover: styleSettings.colors.aqua,
    buttonMainBackgroundColor: styleSettings.colors.white,
    buttonMainColor: styleSettings.colors.black,
    buttonSecondaryBackgroundColor: 'rgba(255, 255, 255, 0.06)',
    buttonSecondaryColor: 'rgba(255, 255, 255, 0.69)',
    buttonTextColor: styleSettings.colors.rose,
    buttonTextColorHover: styleSettings.colors.aqua,
    closeButtonBackgroundColor: styleSettings.colors.white,
    closeButtonVariant: 'white',
    defaultTextColor: styleSettings.colors.white,
    navigationBackground: styleSettings.colors.shark,
    navigationButtonBackgroundColor: styleSettings.colors.black,
    navigationButtonTextColor: 'rgba(255, 255, 255, 0.69)',
    navigationButtonBorderColor: styleSettings.colors.rose,
    navigationButtonActiveBackgroundColor: 'rgba(255, 255, 255, 0.06)',
    navigationButtonActiveTextColor: styleSettings.colors.white,
    navigationButtonActiveBorderColor: styleSettings.colors.aqua,
    transparentHoverHighlight: 'rgba(255, 255, 255, 0.3)',
  },
  [ChainThemes.POLKADOT]: {
    blockBackgroundColorHover: styleSettings.colors.cerise,
    bodyBackground: styleSettings.colors.blackHaze,
    borderRadius: '10px',
    buttonBackgroundColor: styleSettings.colors.cerise,
    buttonBorderColor: styleSettings.colors.cerise,
    buttonBorderColorHover: styleSettings.colors.cerise,
    buttonMainBackgroundColor: styleSettings.colors.white,
    buttonMainColor: styleSettings.colors.black,
    buttonSecondaryBackgroundColor: 'rgba(255, 255, 255, 0.06)',
    buttonSecondaryColor: 'rgba(255, 255, 255, 0.69)',
    buttonTextColor: styleSettings.colors.white,
    buttonTextColorHover: styleSettings.colors.white,
    closeButtonBackgroundColor: styleSettings.colors.blackHaze,
    closeButtonVariant: undefined,
    defaultTextColor: styleSettings.colors.shark,
    navigationBackground: styleSettings.colors.shark,
    navigationButtonBackgroundColor: styleSettings.colors.blackHaze,
    navigationButtonTextColor: styleSettings.colors.cerise,
    navigationButtonBorderColor: styleSettings.colors.cerise,
    navigationButtonActiveBackgroundColor: styleSettings.colors.cerise,
    navigationButtonActiveTextColor: styleSettings.colors.white,
    navigationButtonActiveBorderColor: styleSettings.colors.cerise,
    transparentHoverHighlight: 'rgba(0, 0, 0, 0.3)',
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
  border: 2px solid ${({ activeTheme }) => activeTheme.buttonBorderColor};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
  box-sizing: border-box;

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    border-color: ${({ activeTheme }) => activeTheme.buttonBorderColorHover};
    color: ${({ activeTheme }) => activeTheme.buttonTextColorHover};
  }

  a {
    text-decoration: none;
    color: ${({ activeTheme }) => activeTheme.buttonTextColor};
  }
`;

export const SConnectButton = styled.button<Themeable>`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  background-color: ${({ activeTheme }) => activeTheme.buttonMainBackgroundColor};
  color: ${({ activeTheme }) => activeTheme.buttonMainColor};
  border: 0;
  border-radius: 32px;

  svg {
    margin-top: 4px;
  }

  &.active {
    background-color: ${({ activeTheme }) => activeTheme.buttonSecondaryBackgroundColor};
    color: ${({ activeTheme }) => activeTheme.buttonSecondaryColor};
  }
`;
