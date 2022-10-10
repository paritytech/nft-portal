export const deviceScreenSize = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
};

export const styleSettings = {
  colors: {
    blackHaze: '#f4f5f5',
    cerise: '#D33079',
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
