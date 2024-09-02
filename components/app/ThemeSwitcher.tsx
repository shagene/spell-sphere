'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    console.log('ThemeSwitcher mounted')
  }, [])

  const toggleTheme = useCallback(() => {
    const themes = ['default', 'ocean', 'nature']
    const currentIndex = themes.indexOf(theme?.split('-')[0] || 'default')
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = `${themes[nextIndex]}-${resolvedTheme?.includes('dark') ? 'dark' : 'light'}`
    console.log(`ThemeSwitcher: Changing theme to ${nextTheme}`)
    setTheme(nextTheme)
  }, [theme, resolvedTheme, setTheme])

  if (!mounted) return null

  const isDark = resolvedTheme?.includes('dark')
  const currentTheme = theme?.split('-')[0] || 'default'

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {isDark ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}