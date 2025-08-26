import { ThemeColorMode } from '@plait/core';

const THEME_STORAGE_KEY = 'drawnix-theme';

export const saveThemeToStorage = (theme: ThemeColorMode): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

export const loadThemeFromStorage = (): ThemeColorMode | null => {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (
      savedTheme &&
      Object.values(ThemeColorMode).includes(savedTheme as ThemeColorMode)
    ) {
      return savedTheme as ThemeColorMode;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  return null;
};

export const clearThemeFromStorage = (): void => {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear theme from localStorage:', error);
  }
};
