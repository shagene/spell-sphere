'use client'

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const themes = ['default', 'nature', 'ocean', 'sunset'];

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme) {
      const isDark = document.documentElement.classList.contains('dark');
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.toggle('dark', isDark);
      console.log('Theme changed to:', theme);
      console.log('Dark mode:', isDark);
      console.log('Current CSS variables:');
      console.log('--bg-primary:', getComputedStyle(document.documentElement).getPropertyValue('--bg-primary'));
      console.log('--text-primary:', getComputedStyle(document.documentElement).getPropertyValue('--text-primary'));
      console.log('--accent-color:', getComputedStyle(document.documentElement).getPropertyValue('--accent-color'));
    }
  }, [theme, resolvedTheme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-4">
      <select 
        value={theme}
        onChange={(e) => handleThemeChange(e.target.value)}
        className="bg-bg-primary text-text-primary border border-accent-color rounded-md py-2 px-4 text-sm"
      >
        {themes.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
      <button 
        onClick={toggleDarkMode}
        className="bg-accent-color text-bg-primary font-bold py-2 px-4 rounded"
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}