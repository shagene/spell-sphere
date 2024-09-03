'use client'

import { ThemeSwitcher } from './ThemeSwitcher';

export function Header() {

  return (
    <header className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">SpellSphere</h1>
      <ThemeSwitcher />
    </header>
  );
}