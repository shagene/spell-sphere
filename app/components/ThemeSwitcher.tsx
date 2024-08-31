import { useTheme } from 'next-themes';
import { Select, SelectItem, Switch } from "@nextui-org/react";
import { useEffect, useState } from 'react';

const themes = ['default', 'nature', 'ocean', 'sunset'];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleModeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-4">
      <Select 
        label="Theme"
        value={theme}
        onChange={(e) => handleThemeChange(e.target.value)}
        className="min-w-[150px]"
      >
        {themes.map((t) => (
          <SelectItem key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </SelectItem>
        ))}
      </Select>
      <Switch 
        checked={theme === 'dark'}
        onChange={handleModeToggle}
      >
        {theme === 'light' ? 'Light' : 'Dark'}
      </Switch>
    </div>
  );
}