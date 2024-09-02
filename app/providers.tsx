'use client'

import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('Providers mounted')
  }, [])

  return <ThemeProvider>{children}</ThemeProvider>
}