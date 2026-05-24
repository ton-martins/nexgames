export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

export const DEFAULT_THEME = THEMES.LIGHT;
export const THEME_STORAGE_KEY = "nexgames_theme";

export function getStoredTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === THEMES.LIGHT || storedTheme === THEMES.DARK) {
    return storedTheme;
  }

  return null;
}

export function getPreferredTheme() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return THEMES.DARK;
  }

  return THEMES.LIGHT;
}

export function resolveInitialTheme() {
  return getStoredTheme() || getPreferredTheme() || DEFAULT_THEME;
}

export function applyTheme(theme) {
  const validTheme =
    theme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT;

  document.documentElement.setAttribute("data-theme", validTheme);
  localStorage.setItem(THEME_STORAGE_KEY, validTheme);

  return validTheme;
}

export function initializeTheme() {
  return applyTheme(resolveInitialTheme());
}

export function toggleTheme(currentTheme) {
  const nextTheme =
    currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

  return applyTheme(nextTheme);
}