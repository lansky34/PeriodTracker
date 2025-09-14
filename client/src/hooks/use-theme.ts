import { useState, useEffect } from 'react';
import { themeService, themes } from '@/lib/themes';
import { usePro } from './use-pro';

export function useTheme() {
  const { isPro } = usePro();
  const [currentTheme, setCurrentTheme] = useState(themeService.getStoredTheme());

  useEffect(() => {
    themeService.applyTheme(currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    
    // Check if user has access to this theme
    if (theme.isPro && !isPro) {
      return false; // Not allowed
    }

    setCurrentTheme(themeId);
    themeService.applyTheme(themeId);
    return true;
  };

  const getAvailableThemes = () => {
    return themeService.getAvailableThemes(isPro);
  };

  const getCurrentTheme = () => {
    return themes.find(t => t.id === currentTheme);
  };

  return {
    currentTheme: getCurrentTheme(),
    availableThemes: getAvailableThemes(),
    changeTheme,
    isPro
  };
}