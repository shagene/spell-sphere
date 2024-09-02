import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function useLogTheme() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    console.log('useLogTheme: theme changed to', theme);
  }, [theme]);

  useEffect(() => {
    console.log('useLogTheme: resolvedTheme changed to', resolvedTheme);
  }, [resolvedTheme]);
}