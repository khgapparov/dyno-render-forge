import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { Chart } from './Chart';
import { ProjectList } from './ProjectList';
import { ProjectUpdates } from './ProjectUpdates';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Component type definitions for the dynamic engine
 */
export interface ComponentConfig {
  type: 'navbar' | 'sidebar' | 'card' | 'chart' | 'page' | 'container' | 'projectList' | 'projectUpdates';
  props?: Record<string, any>;
  children?: ComponentConfig[];
  id?: string;
  className?: string;
}

export interface LayoutMetadata {
  layout: ComponentConfig;
  theme?: {
    variant: 'default' | 'minimal' | 'modern';
    primaryColor?: string;
  };
  metadata?: {
    title: string;
    description: string;
    version: string;
  };
}

interface LayoutEngineProps {
  metadata: LayoutMetadata;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * LayoutEngine - The core component that dynamically renders the entire application
 * based on JSON metadata configuration. This is the heart of the customizable engine.
 */
export const LayoutEngine = ({ 
  metadata, 
  onError,
  className 
}: LayoutEngineProps) => {
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simulate initialization delay for smooth loading
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, [metadata]);

  /**
   * Component mapper - Maps component types to their React components
   * This is the core of the dynamic rendering system
   */
  const componentMap = {
    navbar: Navbar,
    sidebar: Sidebar,
    card: Card,
    chart: Chart,
    projectList: ProjectList,
    projectUpdates: ProjectUpdates,
    page: ({ children, className, ...props }: any) => (
      <div className={cn("flex-1 min-h-0", className)} {...props}>
        {children}
      </div>
    ),
    container: ({ children, className, ...props }: any) => (
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    )
  };

  /**
   * Recursively render components based on the configuration
   * @param config - Component configuration object
   * @param index - Unique key for React rendering
   * @returns JSX Element or null
   */
  const renderComponent = (config: ComponentConfig, index: number): JSX.Element | null => {
    try {
      const { type, props = {}, children = [], id, className } = config;
      
      // Get the component from the map
      const Component = componentMap[type];
      
      if (!Component) {
        console.warn(`[LayoutEngine] Unknown component type: ${type}`);
        return (
          <div key={id || index} className="p-4 border border-destructive rounded-lg bg-destructive/5">
            <div className="flex items-center text-destructive">
              <AlertCircle className="w-4 h-4 mr-2" />
              Unknown component: {type}
            </div>
          </div>
        );
      }

      // Handle special layout components
      if (type === 'page') {
        const { sidebar, navbar, content, ...pageProps } = props;
        
        return (
          <div key={id || index} className={cn("min-h-screen flex flex-col bg-background", className)}>
            {/* Render navbar if specified */}
            {navbar && renderComponent({ type: 'navbar', props: navbar }, -1)}
            
            <div className="flex flex-1 min-h-0">
              {/* Render sidebar if specified */}
              {sidebar && renderComponent({ type: 'sidebar', props: sidebar }, -2)}
              
              {/* Main content area */}
              <main className="flex-1 overflow-auto">
                {content && renderComponent(content, -3)}
                {children.map((child, childIndex) => renderComponent(child, childIndex))}
              </main>
            </div>
          </div>
        );
      }

      // Render regular components
      const childElements = children.length > 0 
        ? children.map((child, childIndex) => renderComponent(child, childIndex))
        : undefined;

      return (
        <Component
          key={id || index}
          className={className}
          {...props}
        >
          {childElements}
        </Component>
      );

    } catch (error) {
      console.error(`[LayoutEngine] Error rendering component:`, error);
      setRenderError(error instanceof Error ? error.message : 'Unknown rendering error');
      onError?.(error instanceof Error ? error : new Error('Unknown rendering error'));
      
      return (
        <div key={index} className="p-4 border border-destructive rounded-lg bg-destructive/5">
          <div className="flex items-center text-destructive mb-2">
            <AlertCircle className="w-4 h-4 mr-2" />
            Rendering Error
          </div>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to render component'}
          </p>
        </div>
      );
    }
  };

  // Loading state
  if (!isInitialized) {
    return (
      <div className={cn("min-h-screen bg-background", className)}>
        {/* Loading skeleton */}
        <div className="h-16 border-b border-border">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex">
          <Skeleton className="w-64 h-screen" />
          <div className="flex-1 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (renderError) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center bg-background", className)}>
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Layout Engine Error
          </h2>
          <p className="text-muted-foreground mb-4">
            {renderError}
          </p>
          <Button 
            onClick={() => {
              setRenderError(null);
              setIsInitialized(false);
              setTimeout(() => setIsInitialized(true), 100);
            }}
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Validate metadata structure
  if (!metadata?.layout) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center bg-background", className)}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Invalid Metadata
          </h2>
          <p className="text-muted-foreground">
            The provided metadata is missing required layout configuration.
          </p>
        </div>
      </div>
    );
  }

  console.log('[LayoutEngine] Rendering layout with metadata:', metadata);

  // Render the main layout
  return (
    <div className={cn("w-full", className)}>
      {renderComponent(metadata.layout, 0)}
    </div>
  );
};
