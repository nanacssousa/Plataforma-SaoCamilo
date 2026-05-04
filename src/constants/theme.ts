export const colors = {
  // Brand — Vermelho
  primary: '#8f000a',
  primaryContainer: '#b51b1b',
  primaryDark: '#8B1010',
  primaryLight: '#D32F2F',
  primaryTint: '#FFF5F5',
 
  // Secundárias
  secondary: '#0062a1',
  tertiary: '#004874',
 
  // Superfícies (sistema Material-like)
  surface: '#fcf9f5',
  surfaceContainer: '#f0ede9',
  surfaceContainerLow: '#f6f3ef',
  surfaceContainerHigh: '#ebe8e4',
  surfaceContainerHighest: '#e5e2de',
 
  // Superfícies (aliases semânticos)
  background: '#FAFAF8',
  warm: '#F7F4F0',
 
  // Textos sobre superfície
  onSurface: '#1c1c1a',
  onSurfaceVariant: '#5b403d',
  outlineVariant: '#e4beb9',
 
  // Escala de cinzas quentes
  gray200: '#D6D0C8',
  gray400: '#8F8880',
  gray700: '#332F2B',
 
  // Semânticas
  success: '#1A6B35',
  info: '#1159AF',
  warning: '#A05C0A',
  error: '#C81010',
 
  // Base
  white: '#ffffff',
  black: '#000000',
};
 
// Famílias tipográficas — usadas pelo typography.ts
export const fontFamilies = {
  headline: 'Newsreader_400Regular',
  headlineBold: 'Newsreader_700Bold',
  headlineItalic: 'Newsreader_400Regular_Italic',
  body: 'Inter_400Regular',
  bodyBold: 'Inter_700Bold',
  technical: 'SourceSans3_400Regular',
  technicalBold: 'SourceSans3_700Bold',
};
 
// Espaçamentos — uso direto nos styles (ex: padding: spacing.s4)
export const spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s12: 48,
};
 
// Border radius — uso direto nos styles (ex: borderRadius: radius.lg)
export const radius = {
  xs: 3,    // botões pequenos
  md: 10,   // inputs
  lg: 16,   // cards
  xl: 22,   // modais
  pill: 9999,
};