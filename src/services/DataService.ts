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
      
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }
      
      // Cache the successful response
      if (useCache) {
        this.cache.set(url, { data: result.data, timestamp: Date.now() });
      }
      
      return result.data;
    } catch (error) {
      console.error(`[DataService] Error fetching from ${url}:`, error);
      
      // Return mock data for development
      return this.getMockData(url);
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