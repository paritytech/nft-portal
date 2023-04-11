import styled, { css } from 'styled-components';

import { ChainThemes } from './constants';
import { CommonStyleProps, ThemeStyle, Themeable } from './interfaces';

export const deviceScreenSize = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1250px',
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
};

// ============
// THEME STYLES
// ============
export const themes: Record<ChainThemes, ThemeStyle> = {
  [ChainThemes.KUSAMA]: {
    backgroundSystem: '#101015',
    backgroundPrimary: '#101015',
    backgroundSecondary: '#1E1E23',
    backgroundTertiary: '#2C2C30',

    textAndIconsPrimary: '#FFFFFF',
    textAndIconsSecondary: 'rgba(255, 255, 255, 0.69)',
    textAndIconsTertiary: 'rgba(255, 255, 255, 0.48)',
    textAndIconsDisabled: 'rgba(255, 255, 255, 0.27)',

    buttonMainBackground: '#FFFFFF',
    buttonMainText: '#000000',
    buttonMainBackgroundHovered: 'rgba(0, 0, 0, 0.8)',

    buttonSecondaryBackground: '#000000',
    buttonSecondaryText: '#FFFFFF',
    buttonSecondaryBackgroundHovered: 'rgba(255, 255, 255, 0.24)',

    fill30: 'rgba(255, 255, 255, 0.3)',
    fill24: 'rgba(255, 255, 255, 0.24)',
    fill18: 'rgba(255, 255, 255, 0.18)',
    fill12: 'rgba(255, 255, 255, 0.12)',
    fill6: 'rgba(255, 255, 255, 0.06)',

    appliedOverlay: 'rgba(0, 0, 0, 0.7)',
    appliedHover: 'rgba(255, 255, 255, 0.05)',
    appliedStroke: 'rgba(255, 255, 255, 0.12)',
    appliedSeparator: 'rgba(255, 255, 255, 0.08)',

    accentsPink: '#F272B6',
    accentsRed: '#FE8D81',
    accentsGreen: '#56F39A',

    forcedWhite: '#FFFFFF',
    forcedBlack: '#000000',
  },
  [ChainThemes.POLKADOT]: {
    backgroundSystem: '#F3F3F2',
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#FFFFFF',

    textAndIconsPrimary: '#000000',
    textAndIconsSecondary: 'rgba(0, 0, 0, 0.66)',
    textAndIconsTertiary: 'rgba(0, 0, 0, 0.45)',
    textAndIconsDisabled: 'rgba(0, 0, 0, 0.25)',

    buttonMainBackground: '#000000',
    buttonMainText: '#FFFFFF',
    buttonMainBackgroundHovered: 'rgba(255, 255, 255, 0.8)',

    buttonSecondaryBackground: '#FFFFFF',
    buttonSecondaryText: '#000000',
    buttonSecondaryBackgroundHovered: 'rgba(0, 0, 0, 0.24)',

    fill30: 'rgba(0, 0, 0, 0.3)',
    fill24: 'rgba(0, 0, 0, 0.24)',
    fill18: 'rgba(0, 0, 0, 0.18)',
    fill12: 'rgba(0, 0, 0, 0.12)',
    fill6: 'rgba(0, 0, 0, 0.06)',

    appliedOverlay: 'rgba(0, 0, 0, 0.4)',
    appliedHover: 'rgba(0, 0, 0, 0.05)',
    appliedStroke: 'rgba(0, 0, 0, 0.12)',
    appliedSeparator: 'rgba(0, 0, 0, 0.08)',

    accentsPink: '#E6007A',
    accentsRed: '#FD4935',
    accentsGreen: '#48CC81',

    forcedWhite: '#FFFFFF',
    forcedBlack: '#000000',
  },
};

// ============
// CSS SNIPPETS
// ============
export const CssBoldXXL = css`
  font-family: 'Unbounded', cursive;
  font-size: 40px;
  font-weight: 700;
`;

export const CssBoldXL = css`
  font-family: 'Unbounded', cursive;
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
`;

export const CssBoldL = css`
  font-family: 'Unbounded', cursive;
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
`;

export const CssBoldM = css`
  font-family: 'Unbounded', cursive;
  font-size: 16px;
  line-height: 20px;
  font-weight: 700;
`;

export const CssSemiBoldXL = css`
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  line-height: 40px;
  font-weight: 600;
`;

export const CssSemiBoldL = css`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
`;

export const CssSemiBoldM = css`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
`;

export const CssSemiBoldS = css`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
`;

export const CssSemiBoldXS = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
`;

export const CssRegularL = css`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
`;

export const CssRegularM = css`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
`;

export const CssRegularS = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
`;

export const CssButtonMini = css`
  line-height: 30px;
  padding: 0 25px;
`;

export const CssButtonXMini = css`
  line-height: 30px;
  height: 30px;
  padding: 0 15px;
  font-size: 16px;
`;

export const CssCommonButtonStyles = css<CommonStyleProps & Themeable>`
  height: 50px;
  padding: 0 50px;
  color: ${({ activeTheme }) => activeTheme.buttonMainText};
  background-color: ${({ activeTheme }) => activeTheme.buttonMainBackground};
  font-size: 20px;
  border-radius: 32px;
  border: none;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
  box-sizing: border-box;

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    color: ${({ activeTheme }) => activeTheme.buttonMainBackgroundHovered};
  }

  a {
    text-decoration: none;
    color: ${({ activeTheme }) => activeTheme.buttonMainText};
  }
`;

// ==========================
// STYLED BASIC HTML ELEMENTS
// ==========================
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

export const SConnectButton = styled.button<Themeable>`
  ${CssSemiBoldS}
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  line-height: 48px;
  padding: 0 8px;
  background-color: ${({ activeTheme }) => activeTheme.buttonMainBackground};
  color: ${({ activeTheme }) => activeTheme.buttonMainText};
  border: 0;
  border-radius: 32px;

  &.active {
    background-color: ${({ activeTheme }) => activeTheme.fill6};
    color: ${({ activeTheme }) => activeTheme.textAndIconsSecondary};
  }

  .identicon {
    width: 32px;
  }

  .arrow-down {
    margin: 4px 12px 0 2px;
    width: 15px;
  }
`;

export const SRow = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 30px;
`;

export const SColumn = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
