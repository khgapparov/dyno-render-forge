import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Settings, Bell } from 'lucide-react';

interface NavbarProps {
  title?: string;
  showThemeToggle?: boolean;
  showNotifications?: boolean;
  actions?: Array<{
    icon: string;
    label: string;
    onClick: () => void;
  }>;
}

/**
 * Navbar Component - Dynamic navigation bar for the engine
 * Supports theme switching, notifications, and custom actions
 */
export const Navbar = ({ 
  title = "Engine Dashboard",
  showThemeToggle = true,
  showNotifications = true,
  actions = []
}: NavbarProps) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="h-16 border-b border-border bg-engine-surface backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-engine-text-primary bg-gradient-primary bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Custom actions */}
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className="text-engine-text-secondary hover:text-engine-text-primary hover:bg-secondary/50"
            >
              <Settings className="w-4 h-4" />
              <span className="sr-only">{action.label}</span>
            </Button>
          ))}

          {/* Notifications */}
          {showNotifications && (
            <Button
              variant="ghost"
              size="sm"
              className="text-engine-text-secondary hover:text-engine-text-primary hover:bg-secondary/50"
            >
              <Bell className="w-4 h-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          )}

          {/* Theme toggle */}
          {showThemeToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-engine-text-secondary hover:text-engine-text-primary hover:bg-secondary/50"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};