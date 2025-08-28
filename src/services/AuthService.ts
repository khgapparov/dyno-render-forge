/**
 * AuthService - Handles authentication, token management, and user sessions
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  name: string;
  // Add other registration fields as needed
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    email: string;
    is_anonymous?: boolean;
  };
  is_anonymous?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  name?: string; // Optional for compatibility
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  is_anonymous?: boolean;
}

class AuthService {
  private readonly API_BASE = 'http://localhost:8081';

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Convert to backend expected format
      const requestBody = {
        username: credentials.username,
        password: credentials.password
      };
      
      const response = await fetch(`${this.API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      
      // Convert to our expected format
      const data: AuthResponse = {
        access_token: responseData.access_token,
        token_type: responseData.token_type,
        user_id: responseData.user_id,
        user: responseData.user,
        is_anonymous: responseData.is_anonymous
      };
      
      // Store token
      this.setToken(data.access_token);
      
      return data;
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Convert to backend expected format
      const requestBody = {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        name: userData.name
      };
      
      const response = await fetch(`${this.API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      
      // Convert to our expected format
      const data: AuthResponse = {
        access_token: responseData.access_token,
        token_type: responseData.token_type,
        user_id: responseData.user_id,
        user: responseData.user,
        is_anonymous: responseData.is_anonymous
      };
      
      // Store token
      this.setToken(data.access_token);
      
      return data;
    } catch (error) {
      console.error('[AuthService] Registration error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.API_BASE}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Authentication expired');
        }
        throw new Error('Failed to fetch user profile');
      }

      return await response.json();
    } catch (error) {
      console.error('[AuthService] Get current user error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('[AuthService] Update profile error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // Redirect to login page or home
    window.location.href = '/';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Set authentication token
   */
  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Store user data
   */
  setUserData(user: UserProfile): void {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  /**
   * Get stored user data
   */
  getUserData(): UserProfile | null {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  /**
   * Refresh token (if your API supports token refresh)
   */
  async refreshToken(): Promise<string> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token to refresh');
      }

      const response = await fetch(`${this.API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      this.setToken(data.token);
      return data.token;
    } catch (error) {
      console.error('[AuthService] Token refresh error:', error);
      this.logout();
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
