import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={toggleTheme}
      className="transition-all duration-300 ease-in-out hover:text-lime-400"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-300" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all duration-300" />
      )}
    </Button>
  );
}

export default ThemeToggle;
