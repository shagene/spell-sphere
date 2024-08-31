'use client';

import React, { ReactNode } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <main>{children}</main>
      <footer>{/* Footer content */}</footer>
    </div>
  );
}