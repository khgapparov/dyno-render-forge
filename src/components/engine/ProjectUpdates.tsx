import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { dataService } from '@/services/DataService';
import { Calendar, User, MessageSquare, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  type: 'PROGRESS' | 'ISSUE' | 'MILESTONE' | 'GENERAL';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  created_at: string;
  author?: {
    name: string;
    role?: string;
  };
  project_id: string;
}

interface ProjectUpdatesProps {
  dataUrl?: string;
  className?: string;
  limit?: number;
  projectId?: string;
  showActions?: boolean;
}

/**
 * ProjectUpdates Component - Displays project updates and timeline from the backend
 */
export const ProjectUpdates = ({ 
  dataUrl,
  className,
  limit,
  projectId,
  showActions = true 
}: ProjectUpdatesProps) => {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = dataUrl || (projectId ? `/projects/${projectId}/updates` : '/updates');
    fetchUpdates(url);
  }, [dataUrl, projectId]);

  const fetchUpdates = async (url: string) => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const data = await dataService.fetchData<ProjectUpdate[]>(url);
      setUpdates(limit ? data.slice(0, limit) : data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load updates');
      console.error('Error fetching updates:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'MILESTONE':
        return { label: 'Milestone', variant: 'success', color: 'text-green-600' };
      case 'PROGRESS':
        return { label: 'Progress', variant: 'default', color: 'text-blue-600' };
      case 'ISSUE':
        return { label: 'Issue', variant: 'destructive', color: 'text-red-600' };
      case 'GENERAL':
      default:
        return { label: 'Update', variant: 'secondary', color: 'text-gray-600' };
    }
  };

  const getPriorityConfig = (priority?: string) => {
    switch (priority) {
      case 'CRITICAL':
        return { label: 'Critical', variant: 'destructive' };
      case 'HIGH':
        return { label: 'High', variant: 'destructive' };
      case 'MEDIUM':
        return { label: 'Medium', variant: 'warning' };
      case 'LOW':
        return { label: 'Low', variant: 'secondary' };
      default:
        return { label: 'Normal', variant: 'outline' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: limit || 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <div className="flex space-x-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive mb-2">Failed to load updates</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => {
            const url = dataUrl || (projectId ? `/projects/${projectId}/updates` : '/updates');
            fetchUpdates(url);
          }}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (updates.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No updates yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Project updates will appear here once they're posted.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {updates.map((update) => {
        const typeConfig = getTypeConfig(update.type);
        const priorityConfig = getPriorityConfig(update.priority);

        return (
          <Card key={update.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">{update.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={typeConfig.variant as any}>
                      {typeConfig.label}
                    </Badge>
                    {update.priority && update.priority !== 'LOW' && (
                      <Badge variant={priorityConfig.variant as any}>
                        {priorityConfig.label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Update Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {update.description}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatRelativeTime(update.created_at)}</span>
                  </div>
                  
                  {update.author && (
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{update.author.name}</span>
                      {update.author.role && (
                        <span className="text-xs opacity-75">({update.author.role})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
