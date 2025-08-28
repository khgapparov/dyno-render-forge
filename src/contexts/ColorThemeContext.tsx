import { createContext, useContext, useEffect, useState } from 'react';

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryGlow: string;
    accent: string;
    surface: string;
  };
}

interface ColorThemeContextType {
  currentPalette: ColorPalette;
  changePalette: (palette: ColorPalette) => void;
  availablePalettes: ColorPalette[];
}

const defaultPalettes: ColorPalette[] = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    colors: {
      primary: '239 68% 68%',
      primaryGlow: '239 84% 78%', 
      accent: '199 89% 48%',
      surface: '220 40% 98%'
    }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    colors: {
      primary: '262 83% 58%',
      primaryGlow: '262 90% 70%',
      accent: '295 72% 67%',
      surface: '265 20% 98%'
    }
  },
  {
    id: 'emerald',
    name: 'Forest Emerald', 
    colors: {
      primary: '158 64% 52%',
      primaryGlow: '158 76% 65%',
      accent: '142 76% 36%',
      surface: '155 20% 98%'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    colors: {
      primary: '25 95% 53%',
      primaryGlow: '25 100% 65%',
      accent: '31 81% 56%',
      surface: '25 20% 98%'
    }
  }
];

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export const ColorThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(defaultPalettes[0]);

  useEffect(() => {
    const savedPalette = localStorage.getItem('colorPalette');
    if (savedPalette) {
      const palette = defaultPalettes.find(p => p.id === savedPalette);
      if (palette) {
        setCurrentPalette(palette);
      }
    }
  }, []);

  useEffect(() => {
    // Apply the color palette to CSS variables
    const root = document.documentElement;
    
    // Light mode colors
    root.style.setProperty('--primary', currentPalette.colors.primary);
    root.style.setProperty('--primary-glow', currentPalette.colors.primaryGlow);
    root.style.setProperty('--accent', currentPalette.colors.accent);
    root.style.setProperty('--ring', currentPalette.colors.primary);
    
    // Update gradients
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${currentPalette.colors.primary}), hsl(${currentPalette.colors.primaryGlow}))`);
    root.style.setProperty('--shadow-glow', `0 0 20px hsl(${currentPalette.colors.primary} / 0.3)`);
    
    // Dark mode adjustments (slightly brighter versions)
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${currentPalette.colors.primaryGlow}), hsl(${currentPalette.colors.primary}))`);
      root.style.setProperty('--shadow-glow', `0 0 20px hsl(${currentPalette.colors.primaryGlow} / 0.4)`);
    }
    
    localStorage.setItem('colorPalette', currentPalette.id);
  }, [currentPalette]);

  const changePalette = (palette: ColorPalette) => {
    setCurrentPalette(palette);
  };

  return (
    <ColorThemeContext.Provider value={{ 
      currentPalette, 
      changePalette, 
      availablePalettes: defaultPalettes 
    }}>
      {children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
};