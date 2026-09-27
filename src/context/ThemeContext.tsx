import React, { createContext, useContext, useEffect } from 'react';

export interface ThemeConfig {
  name: string;
  badge: string;
  isLight: boolean;
  colors: {
    bgApp: string;
    bgNavbar: string;
    bgSurface: string;
    bgCard: string;
    bgInput: string;
    border: string;
    borderSubtle: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    primary: string;
    primaryHover: string;
    primaryLight: string;
    primaryBg: string;
    primaryBorder: string;
    brandGradient: string;
  };
}

// Fixed primary color theme: Warm Linen (Light)
export const FIXED_THEME: ThemeConfig = {
  name: 'Warm Linen',
  badge: 'bg-amber-600',
  isLight: true,
  colors: {
    bgApp: 'bg-[#fcfaf7]',
    bgNavbar: 'bg-[#fcfaf7]/90 border-stone-200/90',
    bgSurface: 'bg-[#f3eee5]',
    bgCard: 'bg-white',
    bgInput: 'bg-white',
    border: 'border-stone-200',
    borderSubtle: 'border-stone-200/70',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-700',
    textMuted: 'text-stone-500',
    primary: 'bg-amber-700 text-white',
    primaryHover: 'hover:bg-amber-800',
    primaryLight: 'text-amber-800',
    primaryBg: 'bg-amber-100/75',
    primaryBorder: 'border-amber-300',
    brandGradient: 'from-amber-700 via-amber-600 to-stone-800'
  }
};

interface ThemeContextType {
  currentTheme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: FIXED_THEME
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    document.body.className = `${FIXED_THEME.colors.bgApp} ${FIXED_THEME.colors.textPrimary} antialiased font-sans`;
    // Clean up any previously stored theme key
    try {
      localStorage.removeItem('ci_theme');
    } catch {
      // Ignore
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme: FIXED_THEME }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
