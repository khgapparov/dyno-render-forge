import { useEffect, useState } from 'react';
import { Card as ShadCard, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { dataService } from '@/services/DataService';
import { TrendingUp, TrendingDown, MoreVertical, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps {
  title: string;
  description?: string;
  dataUrl?: string;
  variant?: 'default' | 'metric' | 'status' | 'chart-summary';
  showActions?: boolean;
  refreshable?: boolean;
  className?: string;
}

/**
 * Card Component - Versatile card for displaying data and metrics
 * Supports multiple variants, data fetching, and interactive features
 */
export const Card = ({
  title,
  description,
  dataUrl,
  variant = 'default',
  showActions = true,
  refreshable = true,
  className
}: CardProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!dataUrl) return;

    setLoading(true);
    setError(null);

    try {
      const result = await dataService.fetchData(dataUrl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataUrl]);

  const handleRefresh = () => {
    dataService.clearCache(dataUrl);
    fetchData();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-6">
          <p className="text-sm text-destructive mb-2">Error loading data</p>
          <p className="text-xs text-engine-text-tertiary">{error}</p>
          {refreshable && (
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-3">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      );
    }

    // Render based on variant
    switch (variant) {
      case 'metric':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-engine-text-primary">
                {data?.total || data?.value || 'N/A'}
              </span>
              {data?.growth && (
                <div className={cn(
                  "flex items-center text-sm",
                  data.growth > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {data.growth > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(data.growth)}%
                </div>
              )}
            </div>
            {data?.subtitle && (
              <p className="text-sm text-engine-text-secondary">{data.subtitle}</p>
            )}
          </div>
        );

      case 'status':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-engine-text-primary">
                {data?.active || 0}
              </p>
              <p className="text-xs text-engine-text-secondary">Active</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-engine-text-primary">
                {data?.total || 0}
              </p>
              <p className="text-xs text-engine-text-secondary">Total</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-engine-text-primary">
                {data?.new || 0}
              </p>
              <p className="text-xs text-engine-text-secondary">New</p>
            </div>
          </div>
        );

      case 'chart-summary':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-engine-text-primary">
                ${data?.total?.toLocaleString() || '0'}
              </span>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">
                  +{data?.growth || 0}%
                </p>
                <p className="text-xs text-engine-text-tertiary">vs last month</p>
              </div>
            </div>
            {data?.monthlyData && (
              <div className="grid grid-cols-6 gap-1">
                {data.monthlyData.slice(-6).map((item: any, index: number) => (
                  <div key={index} className="text-center">
                    <div 
                      className="h-8 bg-gradient-chart rounded-sm mb-1"
                      style={{ 
                        opacity: 0.3 + (item.revenue / 60000) * 0.7 
                      }}
                    />
                    <p className="text-xs text-engine-text-tertiary">
                      {item.month}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            {data ? (
              <pre className="text-sm text-engine-text-secondary whitespace-pre-wrap overflow-auto max-h-40">
                {JSON.stringify(data, null, 2)}
              </pre>
            ) : (
              <p className="text-engine-text-secondary">No data available</p>
            )}
          </div>
        );
    }
  };

  return (
    <ShadCard className={cn(
      "bg-engine-surface border-border shadow-engine-md hover:shadow-engine-lg transition-all duration-200",
      "hover:translate-y-[-2px]",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-engine-text-primary">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-engine-text-secondary mt-1">
                {description}
              </CardDescription>
            )}
          </div>
          {showActions && (
            <div className="flex items-center space-x-1">
              {refreshable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="text-engine-text-tertiary hover:text-engine-text-primary"
                >
                  <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-engine-text-tertiary hover:text-engine-text-primary"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </ShadCard>
  );
};