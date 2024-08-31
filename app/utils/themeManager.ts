const THEME_KEY = 'user_theme_preference';

export function saveThemePreference(theme: string, mode: 'light' | 'dark') {
  localStorage.setItem(THEME_KEY, JSON.stringify({ theme, mode }));
}

export function getThemePreference() {
  const saved = localStorage.getItem(THEME_KEY);
  return saved ? JSON.parse(saved) : { theme: 'default', mode: 'light' };
}

export function applyTheme(theme: string, mode: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-mode', mode);
  document.body.className = `theme-${theme} mode-${mode}`;
}