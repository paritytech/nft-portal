import styled, { css } from 'styled-components';

import { ChainThemes } from './constants';
import { CommonStyleProps, ThemeStyle, Themeable } from './interfaces';

export const deviceScreenSize = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1250px',
};

export const mediaQueries = {
  mobile: `(min-width: ${deviceScreenSize.mobile})`,
  tablet: `(min-width: ${deviceScreenSize.tablet})`,
  desktop: `(min-width: ${deviceScreenSize.desktop})`,
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

    fill80: 'rgba(255, 255, 255, 0.8)',
    fill30: 'rgba(255, 255, 255, 0.3)',
    fill25: 'rgba(255, 255, 255, 0.25)',
    fill24: 'rgba(255, 255, 255, 0.24)',
    fill18: 'rgba(255, 255, 255, 0.18)',
    fill12: 'rgba(255, 255, 255, 0.12)',
    fill8: 'rgba(255, 255, 255, 0.08)',
    fill6: 'rgba(255, 255, 255, 0.06)',

    appliedOverlay: 'rgba(0, 0, 0, 0.7)',
    appliedHover: 'rgba(255, 255, 255, 0.05)',
    appliedStroke: 'rgba(255, 255, 255, 0.12)',
    appliedSeparator: 'rgba(255, 255, 255, 0.08)',
    appliedButtonMain: '#FFFFFF',

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

    fill80: 'rgba(0, 0, 0, 0.8)',
    fill30: 'rgba(0, 0, 0, 0.3)',
    fill25: 'rgba(0, 0, 0, 0.25)',
    fill24: 'rgba(0, 0, 0, 0.24)',
    fill18: 'rgba(0, 0, 0, 0.18)',
    fill12: 'rgba(0, 0, 0, 0.12)',
    fill8: 'rgba(0, 0, 0, 0.08)',
    fill6: 'rgba(0, 0, 0, 0.06)',

    appliedOverlay: 'rgba(0, 0, 0, 0.4)',
    appliedHover: 'rgba(0, 0, 0, 0.05)',
    appliedStroke: 'rgba(0, 0, 0, 0.12)',
    appliedSeparator: 'rgba(0, 0, 0, 0.08)',
    appliedButtonMain: '#000000',

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

// CSS SNIPPETS - FONTS
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

// CSS SNIPPETS - BUTTONS
const commonSizes = css`
  &.XL {
    ${CssSemiBoldL}
    height: 64px;
  }

  &.L {
    ${CssSemiBoldS}
    height: 72px;
    border-radius: 40px;
  }

  &.M {
    ${CssSemiBoldS}
    height: 56px;
  }

  &.S {
    ${CssSemiBoldM}
    height: 48px;
  }
`;

export const CssButtonMainStyles = css<CommonStyleProps & Themeable>`
  padding: 0px 50px;
  color: ${({ activeTheme, isDisabled }) => (isDisabled ? activeTheme.textAndIconsDisabled : activeTheme.forcedBlack)};
  background-color: ${({ activeTheme, isDisabled }) =>
    isDisabled ? activeTheme.fill8 : activeTheme.appliedButtonMain};
  border-radius: 32px;
  border: none;

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ activeTheme, isDisabled }) => (isDisabled ? activeTheme.fill8 : activeTheme.fill80)};
  }

  a {
    text-decoration: none;
    color: ${({ activeTheme, isDisabled }) =>
      isDisabled ? activeTheme.textAndIconsDisabled : activeTheme.forcedBlack};
  }

  ${commonSizes}
`;

export const CssButtonSecondaryStyles = css<CommonStyleProps & Themeable>`
  ${CssSemiBoldS}
  padding: 0px 50px;
  color: ${({ activeTheme, isDisabled }) => (isDisabled ? activeTheme.fill25 : activeTheme.textAndIconsPrimary)};
  background-color: ${({ activeTheme, isDisabled }) => (isDisabled ? activeTheme.fill24 : activeTheme.forcedBlack)};
  border-radius: 32px;
  border: none;

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ activeTheme }) => activeTheme.fill24};
  }

  a {
    text-decoration: none;
    color: ${({ activeTheme, isDisabled }) => (isDisabled ? activeTheme.fill25 : activeTheme.textAndIconsPrimary)};
  }

  ${commonSizes}
`;

export const CssButtonRoundedStyles = css<CommonStyleProps & Themeable>`
  ${CssButtonMainStyles}

  border-radius: 12px;

  ${commonSizes}
`;

export const CssButtonTransparentStyles = css<CommonStyleProps & Themeable>`
  padding: 0px 50px;
  color: ${({ activeTheme, isDisabled }) => (isDisabled ? activeTheme.textAndIconsDisabled : activeTheme.forcedWhite)};
  background-color: ${({ activeTheme }) => activeTheme.fill6};
  border-radius: 32px;
  border: none;

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ activeTheme, isDisabled }) => (isDisabled ? activeTheme.fill6 : activeTheme.fill12)};
  }

  a {
    text-decoration: none;
    color: ${({ activeTheme, isDisabled }) =>
      isDisabled ? activeTheme.textAndIconsDisabled : activeTheme.forcedWhite};
  }

  &.L {
    ${CssSemiBoldS}
    height: 64px;
  }

  &.S {
    ${CssRegularS}
    height: 36px;
  }
`;

export const CssButtonStrokeStyles = css<CommonStyleProps & Themeable>`
  ${CssSemiBoldM}
  height: 64px;
  padding: 0px 50px;
  color: ${({ activeTheme, isDisabled }) =>
    isDisabled ? activeTheme.textAndIconsDisabled : activeTheme.textAndIconsSecondary};
  background-color: transparent;
  border-radius: 32px;
  border: 1px solid ${({ activeTheme }) => activeTheme.appliedStroke};
  box-sizing: border-box;

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ activeTheme, isDisabled }) => (isDisabled ? 'transparent' : activeTheme.fill6)};
  }

  a {
    text-decoration: none;
    color: ${({ activeTheme, isDisabled }) =>
      isDisabled ? activeTheme.textAndIconsDisabled : activeTheme.textAndIconsSecondary};
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
  background-color: ${({ activeTheme }) => activeTheme.appliedButtonMain};
  color: ${({ activeTheme }) => activeTheme.forcedBlack};
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
