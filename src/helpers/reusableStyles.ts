import styled, { css } from 'styled-components';

import { ChainThemes } from './constants';
import { CommonStyleProps, ThemeStyle } from './interfaces';

export const deviceScreenSize = {
  mobile: '480px',
  tablet: '900px',
  desktop: '1300px',
};

export const mediaQueries = {
  mobile: `(min-width: ${deviceScreenSize.mobile})`,
  tablet: `(min-width: ${deviceScreenSize.tablet})`,
  desktop: `(min-width: ${deviceScreenSize.desktop})`,
};

export const CLEAN_BACKGROUND_CLASSNAME = 'no-gradient';

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
    fill10: 'rgba(255, 255, 255, 0.10)',
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
    fill10: 'rgba(0, 0, 0, 0.10)',
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
export const CssArrowDown = css`
  width: 30px;
  height: 30px;
  rotate: 90deg;
  margin-top: 3px;
`;

export const CssCallToAction = css`
  &.call-to-action {
    box-shadow: 0 0 0 8px ${({ theme }) => theme.fill6};
  }
`;

export const CssFormControl = css`
  background-color: ${({ theme }) => theme.fill6};
  color: ${({ theme }) => theme.textAndIconsPrimary};
  border: 0;
  box-sizing: border-box;
  padding-left: 24px;
  transition: none;
  outline: 0;

  :hover {
    border: 4px solid ${({ theme }) => theme.fill12};
    padding-left: 20px;
  }

  :focus {
    background-color: ${({ theme }) => theme.fill6};
    color: ${({ theme }) => theme.textAndIconsPrimary};
    border: 2px solid ${({ theme }) => theme.textAndIconsPrimary};
    padding-left: 22px;
    box-shadow: none;
  }

  :disabled {
    background: none;
    padding-left: 23px;
    border: 1px solid ${({ theme }) => theme.fill12};
    color: ${({ theme }) => theme.textAndIconsDisabled};
    cursor: not-allowed;
  }
`;

export const CssInclusivelyHidden = css`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

// CSS SNIPPETS - FONTS
export const CssFontBoldXXL = css`
  font-family: 'Unbounded', cursive;
  font-size: 40px;
  font-weight: 700;
`;

export const CssFontBoldXL = css`
  font-family: 'Unbounded', cursive;
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
`;

export const CssFontBoldL = css`
  font-family: 'Unbounded', cursive;
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
`;

export const CssFontBoldM = css`
  font-family: 'Unbounded', cursive;
  font-size: 16px;
  line-height: 20px;
  font-weight: 700;
`;

export const CssFontSemiBoldXL = css`
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  line-height: 40px;
  font-weight: 600;
`;

export const CssFontSemiBoldL = css`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
`;

export const CssFontSemiBoldM = css`
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
`;

export const CssFontSemiBoldS = css`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
`;

export const CssFontSemiBoldXS = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
`;

export const CssFontRegularXL = css`
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  line-height: 40px;
  font-weight: 400;
`;

export const CssFontRegularL = css`
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
`;

export const CssFontRegularM = css`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
`;

export const CssFontRegularS = css`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
`;

// CSS SNIPPETS - BUTTONS
const CssCommonSizes = css`
  &.XL {
    ${CssFontSemiBoldL}
    height: 64px;
  }

  &.L {
    ${CssFontSemiBoldS}
    height: 72px;
    border-radius: 40px;
  }

  &.M {
    ${CssFontSemiBoldS}
    height: 56px;
  }

  &.S {
    ${CssFontSemiBoldM}
    height: 48px;
  }

  &.XS {
    ${CssFontSemiBoldXS}
    height: 24px;
  }
`;

export const CssButtonMainStyles = css<CommonStyleProps>`
  color: ${({ theme, isDisabled }) => (isDisabled ? theme.textAndIconsDisabled : theme.forcedBlack)};
  background-color: ${({ theme, isDisabled }) => (isDisabled ? theme.fill8 : theme.appliedButtonMain)};

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ theme, isDisabled }) => (isDisabled ? theme.fill8 : theme.fill80)};
  }

  a {
    text-decoration: none;
    color: ${({ theme, isDisabled }) => (isDisabled ? theme.textAndIconsDisabled : theme.forcedBlack)};
  }

  ${CssCallToAction}

  ${CssCommonSizes}
`;

export const CssButtonSecondaryStyles = css<CommonStyleProps>`
  ${CssFontSemiBoldS}
  color: ${({ theme, isDisabled }) => (isDisabled ? theme.fill25 : theme.textAndIconsPrimary)};
  background-color: ${({ theme, isDisabled }) => (isDisabled ? theme.fill24 : theme.forcedBlack)};

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ theme }) => theme.fill24};
  }

  a {
    text-decoration: none;
    color: ${({ theme, isDisabled }) => (isDisabled ? theme.fill25 : theme.textAndIconsPrimary)};
  }

  ${CssCommonSizes}
`;

export const CssButtonRoundedStyles = css<CommonStyleProps>`
  ${CssButtonMainStyles}

  border-radius: 12px;

  ${CssCommonSizes}
`;

export const CssButtonTransparentStyles = css<CommonStyleProps>`
  color: ${({ theme, isDisabled }) => (isDisabled ? theme.textAndIconsDisabled : theme.forcedWhite)};
  background-color: ${({ theme }) => theme.fill6};

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ theme, isDisabled }) => (isDisabled ? theme.fill6 : theme.fill12)};
  }

  a {
    text-decoration: none;
    color: ${({ theme, isDisabled }) => (isDisabled ? theme.textAndIconsDisabled : theme.forcedWhite)};
  }

  &.L {
    ${CssFontSemiBoldS}
    height: 64px;
  }

  &.S {
    ${CssFontRegularS}
    height: 36px;
    color: ${({ theme, isDisabled }) => (isDisabled ? theme.textAndIconsDisabled : theme.textAndIconsSecondary)};
  }
`;

export const CssButtonStrokeStyles = css<CommonStyleProps>`
  ${CssFontSemiBoldM}
  height: 64px;
  color: ${({ theme, isDisabled }) => (isDisabled ? theme.textAndIconsDisabled : theme.textAndIconsSecondary)};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.appliedStroke};
  box-sizing: border-box;

  :hover {
    cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ theme, isDisabled }) => (isDisabled ? 'transparent' : theme.fill6)};
  }

  a {
    text-decoration: none;
    color: ${({ theme, isDisabled }) => (isDisabled ? theme.textAndIconsDisabled : theme.textAndIconsSecondary)};
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

export const SConnectButton = styled.button`
  ${CssFontSemiBoldS}
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  line-height: 48px;
  padding: 0 24px;
  background-color: ${({ theme }) => theme.appliedButtonMain};
  color: ${({ theme }) => theme.forcedBlack};
  border: 0;
  border-radius: 32px;

  &.active {
    padding: 0 8px;
    background-color: ${({ theme }) => theme.fill6};
    color: ${({ theme }) => theme.textAndIconsSecondary};
  }

  .identicon {
    width: 32px;
  }

  .arrow-down {
    ${CssArrowDown}
  }

  ${CssCallToAction}
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

export const SActionButton = styled.button`
  padding: 0 16px;
  border-radius: 32px;
  border: none;

  &.main {
    ${CssButtonMainStyles}
  }

  &.secondary {
    ${CssButtonSecondaryStyles}
  }

  &.rounded {
    ${CssButtonRoundedStyles}
  }

  &.transparent {
    ${CssButtonTransparentStyles}
  }

  &.stroke {
    ${CssButtonStrokeStyles}
  }

  &.padding32 {
    padding: 0 32px;
  }

  &.full-width {
    width: 100%;
    box-sizing: border-box;
  }
`;

export const SFormBlock = styled.div`
  margin-bottom: 40px;
`;
