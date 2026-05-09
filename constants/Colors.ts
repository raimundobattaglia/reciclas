export type ColorScheme = 'light' | 'dark';

export const palette = {
  green50: '#E8F5E9',
  green100: '#C8E6C9',
  green500: '#2E7D32',
  green600: '#1B5E20',
  green700: '#0F4014',
  amber500: '#F59E0B',
  red500: '#DC2626',
  blue500: '#2563EB',
};

export default {
  light: {
    text: '#0E1612',
    textMuted: '#5C6B66',
    background: '#F5F7F4',
    surface: '#FFFFFF',
    surfaceElev: '#FFFFFF',
    border: '#E2E7E2',
    tint: palette.green500,
    tintStrong: palette.green600,
    tintSoft: palette.green50,
    accent: '#0E7C66',
    warning: palette.amber500,
    danger: palette.red500,
    info: palette.blue500,
    onTint: '#FFFFFF',
    shadow: 'rgba(15, 64, 20, 0.08)',
  },
  dark: {
    text: '#ECF1EE',
    textMuted: '#9AA8A2',
    background: '#0B1410',
    surface: '#13201A',
    surfaceElev: '#172620',
    border: '#1F2D26',
    tint: '#5DBE6A',
    tintStrong: '#86D094',
    tintSoft: '#162A1A',
    accent: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#60A5FA',
    onTint: '#0B1410',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
};
