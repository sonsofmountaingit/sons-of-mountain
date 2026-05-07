// Advanced Puck Theming System

export const designTokens = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
  },
  typography: {
    fontFamilies: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      heading: 'Georgia, serif',
      mono: '"Courier New", monospace',
    },
    fontSizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },
  borderRadius: {
    none: '0',
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// Light and Dark Themes
export const themes = {
  light: {
    background: designTokens.colors.white,
    foreground: designTokens.colors.gray[900],
    muted: designTokens.colors.gray[100],
    mutedForeground: designTokens.colors.gray[600],
    border: designTokens.colors.gray[200],
    primary: designTokens.colors.primary,
    primaryForeground: designTokens.colors.white,
    secondary: designTokens.colors.secondary,
    secondaryForeground: designTokens.colors.white,
  },
  dark: {
    background: designTokens.colors.gray[950],
    foreground: designTokens.colors.gray[50],
    muted: designTokens.colors.gray[800],
    mutedForeground: designTokens.colors.gray[400],
    border: designTokens.colors.gray[700],
    primary: '#4f9fff',
    primaryForeground: designTokens.colors.gray[950],
    secondary: '#8b5cf6',
    secondaryForeground: designTokens.colors.gray[950],
  },
}

// Generate CSS variables from theme
export function generateThemeCSS(theme: typeof themes.light, name: string = 'light') {
  const vars = Object.entries(theme).map(([key, value]) => `  --${name}-${key}: ${value};`).join('\n')
  return `[data-theme="${name}"] {\n${vars}\n}`
}

// Component-level theming
export const componentThemes = {
  button: {
    primary: {
      background: designTokens.colors.primary,
      color: designTokens.colors.white,
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
      borderRadius: designTokens.borderRadius.md,
      fontWeight: designTokens.typography.fontWeights.semibold,
      cursor: 'pointer',
      border: 'none',
      transition: designTokens.transitions.fast,
    },
    secondary: {
      background: designTokens.colors.gray[200],
      color: designTokens.colors.gray[900],
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
      borderRadius: designTokens.borderRadius.md,
      fontWeight: designTokens.typography.fontWeights.normal,
      cursor: 'pointer',
      border: 'none',
      transition: designTokens.transitions.fast,
    },
  },
  card: {
    background: designTokens.colors.white,
    border: `1px solid ${designTokens.colors.gray[200]}`,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing[6],
    boxShadow: designTokens.shadows.base,
  },
  input: {
    padding: designTokens.spacing[3],
    borderRadius: designTokens.borderRadius.base,
    border: `1px solid ${designTokens.colors.gray[300]}`,
    fontSize: designTokens.typography.fontSizes.base,
    fontFamily: designTokens.typography.fontFamilies.base,
    transition: designTokens.transitions.normal,
  },
}

export const generateThemeSheet = () => `
:root {
  ${Object.entries(designTokens.colors.gray).map(([key, val]) => `--gray-${key}: ${val};`).join('\n  ')}
  ${Object.entries(designTokens.typography.fontSizes).map(([key, val]) => `--font-size-${key}: ${val};`).join('\n  ')}
  ${Object.entries(designTokens.spacing).map(([key, val]) => `--spacing-${key}: ${val};`).join('\n  ')}
}

${generateThemeCSS(themes.light, 'light')}
${generateThemeCSS(themes.dark, 'dark')}

[data-theme="dark"] {
  color-scheme: dark;
}
`
