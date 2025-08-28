import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Users, 
  Settings, 
  Home,
  TrendingUp,
  PieChart
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  items?: SidebarItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

/**
 * Sidebar Component - Collapsible navigation sidebar
 * Supports dynamic menu items and state management
 */
export const Sidebar = ({
  items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'Home', active: true },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'users', label: 'Users', icon: 'Users' },
    { id: 'reports', label: 'Reports', icon: 'TrendingUp' },
    { id: 'charts', label: 'Charts', icon: 'PieChart' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ],
  collapsible = true,
  defaultCollapsed = false
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Icon mapping for dynamic rendering
  const iconMap: Record<string, any> = {
    Home,
    BarChart3,
    Users,
    Settings,
    TrendingUp,
    PieChart
  };

  const handleItemClick = (item: SidebarItem) => {
    console.log(`[Sidebar] Navigation to ${item.id}`);
    item.onClick?.();
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-engine-surface border-r border-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with collapse toggle */}
      {collapsible && (
        <div className="h-16 flex items-center justify-end px-4 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-engine-text-secondary hover:text-engine-text-primary"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {/* Navigation items */}
      <nav className="p-4 space-y-2">
        {items.map((item) => {
          const IconComponent = iconMap[item.icon] || Home;
          
          return (
            <Button
              key={item.id}
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left transition-all duration-200",
                isCollapsed ? "px-3" : "px-4",
                item.active
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-engine-sm"
                  : "text-engine-text-secondary hover:text-engine-text-primary hover:bg-secondary/50"
              )}
              onClick={() => handleItemClick(item)}
            >
              <IconComponent className={cn("w-4 h-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              {isCollapsed && (
                <span className="sr-only">{item.label}</span>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer info when expanded */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-gradient-surface rounded-lg border border-border shadow-engine-sm">
            <p className="text-xs text-engine-text-tertiary">
              Dynamic Engine v1.0
            </p>
            <p className="text-xs text-engine-text-secondary">
              Powered by JSON metadata
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};