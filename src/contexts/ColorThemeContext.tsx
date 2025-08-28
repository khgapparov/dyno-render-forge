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
    name: 'Professional Blue',
    colors: {
      primary: '221 83% 53%',      // Deep professional blue
      primaryGlow: '221 90% 65%',  // Brighter blue for glow
      accent: '199 89% 48%',       // Complementary teal
      surface: '210 40% 98%'       // Clean light blue background
    }
  },
  {
    id: 'indigo',
    name: 'Modern Indigo',
    colors: {
      primary: '243 75% 59%',      // Rich indigo
      primaryGlow: '243 85% 72%',  // Bright indigo glow
      accent: '279 75% 65%',       // Soft purple accent
      surface: '240 20% 99%'       // Very light indigo background
    }
  },
  {
    id: 'teal',
    name: 'Corporate Teal', 
    colors: {
      primary: '173 80% 40%',      // Professional teal
      primaryGlow: '173 85% 52%',  // Bright teal glow
      accent: '195 85% 45%',       // Complementary blue
      surface: '180 25% 98%'       // Clean teal-tinged background
    }
  },
  {
    id: 'slate',
    name: 'Minimal Slate',
    colors: {
      primary: '215 25% 27%',      // Dark slate blue
      primaryGlow: '215 35% 40%',  // Medium slate glow
      accent: '200 98% 39%',       // Bright blue accent
      surface: '210 20% 98%'       // Clean white background
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
    
    // Apply all color palette variables
    root.style.setProperty('--primary', currentPalette.colors.primary);
    root.style.setProperty('--primary-glow', currentPalette.colors.primaryGlow);
    root.style.setProperty('--accent', currentPalette.colors.accent);
    root.style.setProperty('--ring', currentPalette.colors.primary);
    
    // Update engine surface colors to use the palette
    root.style.setProperty('--engine-surface', currentPalette.colors.surface);
    root.style.setProperty('--engine-surface-elevated', `hsl(${currentPalette.colors.surface} / 0.95)`);
    
    // Update gradients
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${currentPalette.colors.primary}), hsl(${currentPalette.colors.primaryGlow}))`);
    root.style.setProperty('--gradient-surface', `linear-gradient(145deg, hsl(${currentPalette.colors.surface}), hsl(${currentPalette.colors.surface} / 0.9))`);
    root.style.setProperty('--shadow-glow', `0 0 20px hsl(${currentPalette.colors.primary} / 0.3)`);
    
    // Dark mode adjustments (slightly brighter versions)
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${currentPalette.colors.primaryGlow}), hsl(${currentPalette.colors.primary}))`);
      root.style.setProperty('--gradient-surface', `linear-gradient(145deg, hsl(${currentPalette.colors.surface} / 0.9), hsl(${currentPalette.colors.surface} / 0.8))`);
      root.style.setProperty('--shadow-glow', `0 0 20px hsl(${currentPalette.colors.primaryGlow} / 0.4)`);
      
      // Dark mode engine text colors for better contrast
      root.style.setProperty('--engine-text-primary', '248 250 252%');
      root.style.setProperty('--engine-text-secondary', '203 213 225%');
      root.style.setProperty('--engine-text-tertiary', '148 163 184%');
    } else {
      // Light mode engine text colors
      root.style.setProperty('--engine-text-primary', '15 23 42%');
      root.style.setProperty('--engine-text-secondary', '71 85 105%');
      root.style.setProperty('--engine-text-tertiary', '148 163 184%');
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
