export interface Theme {
  id: string;
  name: string;
  description: string;
  isPro: boolean;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
    card: string;
    cardForeground: string;
    border: string;
    input: string;
    ring: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'FlowTracker Default',
    description: 'The classic FlowTracker look with warm coral tones',
    isPro: false,
    colors: {
      background: '30 40% 99%',
      foreground: '0 0% 17%',
      primary: '355 70% 70%',
      primaryForeground: '0 0% 100%',
      secondary: '174 44% 60%',
      secondaryForeground: '0 0% 100%',
      accent: '250 65% 75%',
      accentForeground: '0 0% 100%',
      muted: '0 0% 96%',
      mutedForeground: '0 0% 45%',
      card: '0 0% 100%',
      cardForeground: '0 0% 17%',
      border: '0 0% 90%',
      input: '0 0% 94%',
      ring: '355 70% 70%',
    }
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Elegant rose gold with soft pink accents',
    isPro: true,
    colors: {
      background: '20 14% 99%',
      foreground: '20 14% 4%',
      primary: '346 77% 60%',
      primaryForeground: '355 100% 99%',
      secondary: '340 82% 52%',
      secondaryForeground: '355 100% 99%',
      accent: '12 76% 61%',
      accentForeground: '20 14% 4%',
      muted: '20 14% 96%',
      mutedForeground: '20 14% 45%',
      card: '20 14% 99%',
      cardForeground: '20 14% 4%',
      border: '20 14% 91%',
      input: '20 14% 89%',
      ring: '346 77% 60%',
    }
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    description: 'Calming lavender with purple undertones',
    isPro: true,
    colors: {
      background: '270 20% 99%',
      foreground: '270 15% 8%',
      primary: '262 83% 70%',
      primaryForeground: '270 100% 99%',
      secondary: '250 100% 82%',
      secondaryForeground: '270 15% 8%',
      accent: '280 87% 84%',
      accentForeground: '270 15% 8%',
      muted: '270 20% 96%',
      mutedForeground: '270 15% 45%',
      card: '270 20% 99%',
      cardForeground: '270 15% 8%',
      border: '270 20% 91%',
      input: '270 20% 89%',
      ring: '262 83% 70%',
    }
  },
  {
    id: 'sage-green',
    name: 'Sage Garden',
    description: 'Natural sage green with earthy tones',
    isPro: true,
    colors: {
      background: '120 20% 99%',
      foreground: '120 15% 8%',
      primary: '142 76% 36%',
      primaryForeground: '120 100% 99%',
      secondary: '159 61% 51%',
      secondaryForeground: '120 100% 99%',
      accent: '136 35% 55%',
      accentForeground: '120 15% 8%',
      muted: '120 20% 96%',
      mutedForeground: '120 15% 45%',
      card: '120 20% 99%',
      cardForeground: '120 15% 8%',
      border: '120 20% 91%',
      input: '120 20% 89%',
      ring: '142 76% 36%',
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool ocean blues with teal highlights',
    isPro: true,
    colors: {
      background: '200 20% 99%',
      foreground: '200 15% 8%',
      primary: '199 89% 48%',
      primaryForeground: '200 100% 99%',
      secondary: '187 85% 53%',
      secondaryForeground: '200 100% 99%',
      accent: '204 94% 77%',
      accentForeground: '200 15% 8%',
      muted: '200 20% 96%',
      mutedForeground: '200 15% 45%',
      card: '200 20% 99%',
      cardForeground: '200 15% 8%',
      border: '200 20% 91%',
      input: '200 20% 89%',
      ring: '199 89% 48%',
    }
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm sunset colors with orange and pink',
    isPro: true,
    colors: {
      background: '25 40% 99%',
      foreground: '25 15% 8%',
      primary: '20 100% 69%',
      primaryForeground: '25 100% 99%',
      secondary: '340 82% 65%',
      secondaryForeground: '25 100% 99%',
      accent: '45 93% 58%',
      accentForeground: '25 15% 8%',
      muted: '25 40% 96%',
      mutedForeground: '25 15% 45%',
      card: '25 40% 99%',
      cardForeground: '25 15% 8%',
      border: '25 40% 91%',
      input: '25 40% 89%',
      ring: '20 100% 69%',
    }
  }
];

class ThemeService {
  private storageKey = 'flowtracker-theme';

  getStoredTheme(): string {
    return localStorage.getItem(this.storageKey) || 'default';
  }

  setStoredTheme(themeId: string): void {
    localStorage.setItem(this.storageKey, themeId);
  }

  applyTheme(themeId: string): void {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, `hsl(${value})`);
    });

    // Also set dark mode versions (for now, just use slightly adjusted values)
    root.classList.add('theme-' + themeId);
    
    this.setStoredTheme(themeId);
  }

  getAvailableThemes(isPro: boolean): Theme[] {
    return themes.filter(theme => !theme.isPro || isPro);
  }

  getTheme(themeId: string): Theme | undefined {
    return themes.find(t => t.id === themeId);
  }
}

export const themeService = new ThemeService();