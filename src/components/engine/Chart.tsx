import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { dataService } from '@/services/DataService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { RefreshCw, MoreVertical, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChartProps {
  title: string;
  chartType: 'bar' | 'line' | 'pie' | 'area';
  dataUrl: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  refreshable?: boolean;
  className?: string;
}

/**
 * Chart Component - Dynamic chart renderer supporting multiple chart types
 * Fetches data from API and renders with Recharts
 */
export const Chart = ({
  title,
  chartType = 'bar',
  dataUrl,
  height = 300,
  showLegend = true,
  showGrid = true,
  refreshable = true,
  className
}: ChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await dataService.fetchData(dataUrl);
      
      // Handle different data formats
      if (Array.isArray(result)) {
        setData(result);
      } else if (result.monthlyData) {
        setData(result.monthlyData);
      } else if (result.data) {
        setData(result.data);
      } else {
        // Transform single object to array for pie charts
        setData([result]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
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

  // Color palette for charts
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--primary-glow))', 
    'hsl(var(--accent))',
    'hsl(var(--secondary))',
    'hsl(var(--muted))'
  ];

  const renderChart = () => {
    if (!data.length) return null;

    const commonProps = {
      data,
      height,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--engine-text-secondary))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--engine-text-secondary))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--engine-surface))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              {showLegend && <Legend />}
              <Bar 
                dataKey="sales" 
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
                name="Sales"
              />
              {data[0]?.target && (
                <Bar 
                  dataKey="target" 
                  fill={colors[1]}
                  radius={[4, 4, 0, 0]}
                  name="Target"
                />
              )}
              {data[0]?.revenue && (
                <Bar 
                  dataKey="revenue" 
                  fill={colors[0]}
                  radius={[4, 4, 0, 0]}
                  name="Revenue"
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--engine-text-secondary))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--engine-text-secondary))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--engine-surface))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              {showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke={colors[0]}
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                name="Sales"
              />
              {data[0]?.revenue && (
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={colors[1]}
                  strokeWidth={3}
                  dot={{ fill: colors[1], strokeWidth: 2, r: 4 }}
                  name="Revenue"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = data[0] ? Object.entries(data[0])
          .filter(([key]) => typeof data[0][key] === 'number')
          .map(([key, value]) => ({ name: key, value }))
          : [];

        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-32 text-engine-text-secondary">
            Unsupported chart type: {chartType}
          </div>
        );
    }
  };

  return (
    <Card className={cn(
      "bg-engine-surface border-border shadow-engine-md hover:shadow-engine-lg transition-all duration-200",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-engine-text-primary flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            {title}
          </CardTitle>
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
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-destructive mb-2">Error loading chart</p>
            <p className="text-xs text-engine-text-tertiary">{error}</p>
            {refreshable && (
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-3">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  );
};