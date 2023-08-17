import { css, styled } from 'styled-components';

import { ChainThemes } from './constants.ts';
import { CommonStyleProps, ThemeStyle } from './interfaces.ts';

export const mediaQueries = {
  tablet: '(min-width: 720px)',
  laptop: '(min-width: 980px)',
  desktop: '(min-width: 1440px)',
};

export const ALTERNATE_BACKGROUND_CLASSNAME = 'pure-white';

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
    fill48: 'rgba(255, 255, 255, 0.48)',
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
    appliedLightPinkBackground: 'rgba(230, 0, 122, 0.15)',
    appliedPinkHover: '#D50071',
    appliedPinkActive: '#C9006B',

    accentsPink: '#F272B6',
    accentsRed: '#FE8D81',
    accentsGreen: '#56F39A',

    forcedWhite: '#FFFFFF',
    forcedBlack: '#000000',
  },
  [ChainThemes.POLKADOT]: {
    backgroundSystem: '#F5F4F4',
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#FFFFFF',

    textAndIconsPrimary: '#000000',
    textAndIconsSecondary: 'rgba(0, 0, 0, 0.66)',
    textAndIconsTertiary: 'rgba(0, 0, 0, 0.45)',
    textAndIconsDisabled: 'rgba(0, 0, 0, 0.25)',

    fill80: 'rgba(0, 0, 0, 0.8)',
    fill48: 'rgba(0, 0, 0, 0.48)',
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
    appliedLightPinkBackground: 'rgba(230, 0, 122, 0.15)',
    appliedPinkHover: '#D50071',
    appliedPinkActive: '#C9006B',

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
export const CssArrowUp = css`
  width: 24px;
  height: 24px;
  rotate: -90deg;

  path {
    fill: ${({ theme }) => theme.textAndIconsTertiary};
  }
`;

export const CssArrowDown = css`
  width: 24px;
  height: 24px;
  rotate: 90deg;

  path {
    fill: ${({ theme }) => theme.textAndIconsTertiary};
  }
`;

export const CssFormControl = css`
  color: ${({ theme }) => theme.textAndIconsTertiary};
  border: 1px solid ${({ theme }) => theme.appliedStroke};
  border-radius: 8px;
  box-sizing: border-box;
  transition: none;
  outline: 0;

  &::placeholder {
    color: ${({ theme }) => theme.textAndIconsTertiary};
  }

  &:hover {
    border: 2px solid ${({ theme }) => theme.appliedStroke};
    padding-left: 11px;
  }

  &:focus {
    background-color: ${({ theme }) => theme.fill6};
    color: ${({ theme }) => theme.textAndIconsPrimary};
    border: 2px solid ${({ theme }) => theme.textAndIconsPrimary};
    padding-left: 11px;
    box-shadow: none;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.fill6};
    border: 0;
    padding-left: 11px;
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
  line-height: 48px;
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
export const CssButtonMainStyles = css<CommonStyleProps>`
  height: 48px;
  color: ${({ theme, disabled }) => (disabled ? theme.textAndIconsTertiary : theme.forcedWhite)};
  background-color: ${({ theme, disabled }) => (disabled ? theme.fill6 : theme.accentsPink)};
  border-radius: 32px;
  ${CssFontRegularM}

  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ theme }) => theme.appliedPinkHover};
  }

  &:active {
    background-color: ${({ theme }) => theme.appliedPinkActive};
  }

  a {
    text-decoration: none;
    color: ${({ theme, disabled }) => (disabled ? theme.fill25 : theme.textAndIconsPrimary)};
  }
`;

export const CssButtonMainKingStyles = css<CommonStyleProps>`
  ${CssButtonMainStyles}
  height: 64px;
  ${CssFontRegularL}
`;

export const CssButtonSecondaryStyles = css<CommonStyleProps>`
  height: 48px;
  color: ${({ theme, disabled }) => (disabled ? theme.textAndIconsDisabled : theme.forcedWhite)};
  background-color: ${({ theme, disabled }) => (disabled ? theme.fill6 : theme.appliedButtonMain)};
  ${CssFontRegularM}

  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ theme, disabled }) => (disabled ? theme.fill6 : theme.fill48)};
  }

  a {
    text-decoration: none;
    color: ${({ theme, disabled }) => (disabled ? theme.textAndIconsDisabled : theme.forcedBlack)};
  }
`;

export const CssButtonStrokeStyles = css<CommonStyleProps>`
  height: 48px;
  color: ${({ theme, disabled }) => (disabled ? theme.textAndIconsDisabled : theme.textAndIconsSecondary)};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.appliedStroke};
  box-sizing: border-box;
  ${CssFontSemiBoldS}

  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    background-color: ${({ theme, disabled }) => (disabled ? 'transparent' : theme.fill6)};
  }

  a {
    text-decoration: none;
    color: ${({ theme, disabled }) => (disabled ? theme.textAndIconsDisabled : theme.textAndIconsSecondary)};
  }
`;

// ==========================
// STYLED BASIC HTML ELEMENTS
// ==========================
export const SContentBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;

  @media ${mediaQueries.tablet} {
    justify-content: space-between;
    gap: 10px;
  }

  @media ${mediaQueries.laptop} {
    justify-content: space-between;
    gap: 20px;
  }

  @media ${mediaQueries.desktop} {
    justify-content: normal;
  }
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
  gap: 10px;
  align-items: center;
  padding: 0 24px;
  background-color: ${({ theme }) => theme.appliedLightPinkBackground};
  height: 48px;
  line-height: 48px;
  color: ${({ theme }) => theme.accentsPink};
  border: 0;
  border-radius: 32px;
  box-sizing: border-box;

  &:hover {
    padding: 0 22px;
    background-color: ${({ theme }) => theme.appliedLightPinkBackground};
    border: 2px solid ${({ theme }) => theme.accentsPink};
  }

  &.active {
    height: 40px;
    line-height: 40px;
    background-color: transparent;
    padding: 0 4px;
    color: ${({ theme }) => theme.textAndIconsPrimary};

    @media ${mediaQueries.tablet} {
      height: 48px;
      line-height: 48px;
      padding: 0 20px 0 8px;
    }

    span {
      display: none;

      @media ${mediaQueries.tablet} {
        display: inline;
      }
    }

    &:hover {
      background-color: ${({ theme }) => theme.appliedHover};

      @media ${mediaQueries.laptop} {
        background-color: ${({ theme }) => theme.appliedLightPinkBackground};
        border: 2px solid ${({ theme }) => theme.accentsPink};
      }
    }
  }

  &.active:hover,
  &.actions-active {
    background-color: ${({ theme }) => theme.appliedHover};
    border: 0;
  }

  &.disconnected {
    height: 40px;
    line-height: 40px;
    background-color: transparent;
    padding: 0 4px;

    @media ${mediaQueries.laptop} {
      height: 48px;
      line-height: 48px;
      padding: 0 24px;
      background-color: ${({ theme }) => theme.appliedLightPinkBackground};
    }

    &:hover {
      background-color: ${({ theme }) => theme.appliedHover};
      border: 0;

      @media ${mediaQueries.laptop} {
        padding: 0 22px;
        background-color: ${({ theme }) => theme.appliedLightPinkBackground};
        border: 2px solid ${({ theme }) => theme.accentsPink};
      }
    }

    span {
      display: none;

      @media ${mediaQueries.laptop} {
        display: block;
      }
    }

    svg {
      width: 32px;
      height: 32px;

      @media ${mediaQueries.laptop} {
        display: none;
      }
    }
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

export const SActionButton = styled.button<CommonStyleProps>`
  padding: 0 16px;
  border-radius: 32px;
  border: none;

  &.main {
    ${CssButtonMainStyles}
  }

  &.main-king {
    ${CssButtonMainKingStyles}
  }

  &.secondary {
    ${CssButtonSecondaryStyles}
  }

  &.stroke {
    ${CssButtonStrokeStyles}
  }

  &.padding32 {
    padding: 0 32px;
  }
`;

export const SFormBlock = styled.div`
  margin-bottom: 40px;
`;

export const SH2 = styled.h2`
  ${CssFontSemiBoldM}
`;

export const SPageControls = styled.div`
  max-width: 360px;
  padding: 40px 0;
  margin: 0 auto;

  @media ${mediaQueries.tablet} {
    margin: 0 0 0 auto;
  }
`;

export const SInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  span:first-child {
    color: ${({ theme }) => theme.textAndIconsTertiary};
  }
`;

export const SAside = styled.aside`
  display: none;

  @media ${mediaQueries.tablet} {
    display: block;
  }
`;
