import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function useLogTheme() {
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    console.log(`useLogTheme: theme changed to ${theme}`)
  }, [theme])

  useEffect(() => {
    console.log(`useLogTheme: resolvedTheme changed to ${resolvedTheme}`)
  }, [resolvedTheme])
}