'use client'

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    console.log(`Header: Current theme: ${theme}`);
    console.log(`Header: Resolved theme: ${resolvedTheme}`);
  }, [theme, resolvedTheme]);

  return (
    <header className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">SpellSphere</h1>
      <ThemeSwitcher />
    </header>
  );
}