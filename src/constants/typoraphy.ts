// Coloque em: constants/typography.ts
import { TextStyle } from 'react-native';
import { colors, fontFamilies } from './theme';

export const typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 32,
    color: colors.onSurface,
  },
  h2: {
    fontFamily: fontFamilies.headlineBold,
    fontSize: 24,
    color: colors.onSurface,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    color: colors.onSurface,
    lineHeight: 24,
  },
  technical: {
    fontFamily: fontFamilies.technical,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  label: {
    fontFamily: fontFamilies.technicalBold,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.onSurfaceVariant,
  }
};