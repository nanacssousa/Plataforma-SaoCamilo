export const theme = {
  colors: {
    // Brand — Vermelho
    primary: '#B51B1B',       // --c-red
    primaryDark: '#8B1010',   // --c-red-dark
    primaryLight: '#D32F2F',  // --c-red-light
    primaryTint: '#FFF5F5',   // --c-red-tint
    
    // Superfícies
    background: '#FAFAF8',    // --bg-page[cite: 1]
    surface: '#FFFFFF',       // --bg-white[cite: 1]
    warm: '#F7F4F0',          // --bg-warm[cite: 1]
    
    // Escala de Cinzas Quentes
    gray200: '#D6D0C8',       // --g-200[cite: 1]
    gray400: '#8F8880',       // --g-400[cite: 1]
    gray700: '#332F2B',       // --g-700[cite: 1]
    
    // Semânticas
    success: '#1A6B35',       // --s-ok[cite: 1]
    info: '#1159AF',          // --s-info[cite: 1]
    warning: '#A05C0A',       // --s-warn[cite: 1]
    error: '#C81010',         // --s-err[cite: 1]
  },
  
  spacing: {
    s1: 4, s2: 8, s3: 12, s4: 16, s5: 20, s6: 24, s8: 32, s12: 48
  },
  
  radius: {
    xs: 3,    // Para botões[cite: 1]
    md: 10,   // Para inputs[cite: 1]
    lg: 16,   // Para cards[cite: 1]
    xl: 22,   // Para modais[cite: 1]
    pill: 9999
  }
};