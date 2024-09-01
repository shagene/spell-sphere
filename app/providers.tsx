'use client'

import { ThemeProvider } from 'next-themes'

const themes = ['default', 'nature', 'ocean', 'sunset'];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="default" forcedTheme={undefined} enableSystem={false} themes={themes}>
      {children}
    </ThemeProvider>
  )
}