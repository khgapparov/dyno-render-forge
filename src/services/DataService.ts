/**
 * DataService - Promise-based API service for the customizable engine
 * Handles all API calls and data fetching with proper error handling and caching
 */

interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  error?: string;
}

class DataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch data from a given URL with caching support
   * @param url - API endpoint URL
   * @param useCache - Whether to use cached data (default: true)
   * @returns Promise with the fetched data
   */
  async fetchData<T = any>(url: string, useCache: boolean = true): Promise<T> {
    // Check cache first
    if (useCache && this.cache.has(url)) {
      const cached = this.cache.get(url)!;
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log(`[DataService] Cache hit for ${url}`);
        return cached.data;
      }
    }

    try {
      console.log(`[DataService] Fetching data from ${url}`);
      
      // Add authentication token if available
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Prepend API base URL for relative paths - use correct backend structure
      const fullUrl = url.startsWith('http') ? url : `http://localhost:8081${url}`;
      
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Cache the successful response
      if (useCache) {
        this.cache.set(url, { data: result, timestamp: Date.now() });
      }
      
      return result;
    } catch (error) {
      console.error(`[DataService] Error fetching from ${url}:`, error);
      throw error; // Re-throw to let components handle errors
    }
  }

  /**
   * Mock data generator for development and demonstration
   * @param url - The requested URL to determine data type
   * @returns Mock data based on URL pattern
   */
  private getMockData(url: string): any {
    if (url.includes('/api/sales')) {
      return [
        { month: 'Jan', sales: 4200, target: 4000 },
        { month: 'Feb', sales: 3800, target: 4200 },
        { month: 'Mar', sales: 5100, target: 4500 },
        { month: 'Apr', sales: 4600, target: 4300 },
        { month: 'May', sales: 5400, target: 5000 },
        { month: 'Jun', sales: 6200, target: 5500 }
      ];
    }
    
    if (url.includes('/api/revenue')) {
      return {
        total: 245000,
        growth: 12.5,
        monthlyData: [
          { month: 'Jan', revenue: 38000 },
          { month: 'Feb', revenue: 42000 },
          { month: 'Mar', revenue: 45000 },
          { month: 'Apr', revenue: 41000 },
          { month: 'May', revenue: 48000 },
          { month: 'Jun', revenue: 51000 }
        ]
      };
    }
    
    if (url.includes('/api/users')) {
      return {
        total: 1247,
        active: 892,
        new: 156
      };
    }

    if (url.includes('/api/analytics')) {
      return {
        pageViews: 34500,
        sessions: 12300,
        bounceRate: 0.23,
        avgSessionDuration: 245
      };
    }

    // Project Management Mock Data
    if (url.includes('/api/projects/count')) {
      return 8;
    }

    if (url.includes('/api/projects/recent')) {
      return [
        { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 75 },
        { id: 2, name: 'Mobile App Development', status: 'Completed', progress: 100 },
        { id: 3, name: 'API Integration', status: 'Planning', progress: 25 }
      ];
    }

    if (url.includes('/api/projects/timeline')) {
      return [
        { month: 'Jan', projects: 2, completed: 1 },
        { month: 'Feb', projects: 3, completed: 2 },
        { month: 'Mar', projects: 5, completed: 3 },
        { month: 'Apr', projects: 4, completed: 2 },
        { month: 'May', projects: 6, completed: 4 },
        { month: 'Jun', projects: 8, completed: 5 }
      ];
    }

    if (url.includes('/api/project-updates/recent')) {
      return [
        { id: 1, project: 'Website Redesign', update: 'Completed frontend components', date: '2024-01-15' },
        { id: 2, project: 'Mobile App', update: 'Fixed authentication bug', date: '2024-01-14' },
        { id: 3, project: 'API Integration', update: 'Started backend development', date: '2024-01-13' }
      ];
    }

    if (url.includes('/api/gallery/count')) {
      return 23;
    }

    if (url.includes('/api/chat/unread')) {
      return 3;
    }

    if (url.includes('/api/activity/recent')) {
      return [
        { action: 'Project Created', user: 'John Doe', time: '2 hours ago' },
        { action: 'File Uploaded', user: 'Jane Smith', time: '4 hours ago' },
        { action: 'Comment Added', user: 'Mike Johnson', time: '6 hours ago' }
      ];
    }

    if (url.includes('/api/projects')) {
      return [
        { id: 1, name: 'Website Redesign', description: 'Complete website overhaul', status: 'In Progress', startDate: '2024-01-01', endDate: '2024-03-01' },
        { id: 2, name: 'Mobile App Development', description: 'iOS and Android app', status: 'Completed', startDate: '2023-11-01', endDate: '2024-01-15' },
        { id: 3, name: 'API Integration', description: 'Third-party API integration', status: 'Planning', startDate: '2024-02-01', endDate: '2024-04-01' }
      ];
    }

    if (url.includes('/api/project-updates')) {
      return [
        { id: 1, projectId: 1, title: 'Frontend Completed', content: 'All frontend components are now ready', date: '2024-01-15' },
        { id: 2, projectId: 2, title: 'App Published', content: 'Mobile app published to app stores', date: '2024-01-10' },
        { id: 3, projectId: 3, title: 'Planning Phase', content: 'Initial planning and requirements gathering', date: '2024-01-05' }
      ];
    }

    if (url.includes('/api/gallery')) {
      return [
        { id: 1, name: 'Dashboard Design', type: 'image', projectId: 1, url: '/placeholder.svg' },
        { id: 2, name: 'App Screenshot', type: 'image', projectId: 2, url: '/placeholder.svg' },
        { id: 3, name: 'API Documentation', type: 'document', projectId: 3, url: '/placeholder.svg' }
      ];
    }

    if (url.includes('/api/chat')) {
      return [
        { id: 1, user: 'John Doe', message: 'Has anyone reviewed the latest design?', time: '10:30 AM' },
        { id: 2, user: 'Jane Smith', message: 'Yes, looks good to me!', time: '10:32 AM' },
        { id: 3, user: 'Mike Johnson', message: 'I\'ll check it this afternoon', time: '10:35 AM' }
      ];
    }

    if (url.includes('/api/auth/me')) {
      return {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Project Manager',
        avatar: '/placeholder.svg'
      };
    }
    
    // Default mock data
    return {
      message: 'Mock data for development',
      timestamp: new Date().toISOString(),
      url
    };
  }

  /**
   * Clear cache for a specific URL or all cached data
   * @param url - Optional URL to clear, if not provided clears all cache
   */
  clearCache(url?: string): void {
    if (url) {
      this.cache.delete(url);
      console.log(`[DataService] Cache cleared for ${url}`);
    } else {
      this.cache.clear();
      console.log('[DataService] All cache cleared');
    }
  }

  /**
   * Get cache statistics for debugging
   * @returns Object with cache information
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const dataService = new DataService();
export default dataService;
