// Authentication utility functions
const AuthUtils = {
  // Get token from various storage locations
  getToken: () => {
    return localStorage.getItem('token') || 
           localStorage.getItem('authToken') || 
           localStorage.getItem('accessToken') ||
           localStorage.getItem('jwt') ||
           sessionStorage.getItem('token') ||
           sessionStorage.getItem('authToken') ||
           sessionStorage.getItem('accessToken') ||
           sessionStorage.getItem('jwt');
  },

  // Get user data if stored
  getUser: () => {
    try {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = AuthUtils.getToken();
    const user = AuthUtils.getUser();
    return !!(token && user);
  },

  // Create authenticated headers
  getAuthHeaders: () => {
    const token = AuthUtils.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      // Try different authentication formats
      headers.Authorization = `Bearer ${token}`;
      // Some APIs might use different formats:
      // headers['x-auth-token'] = token;
      // headers['Authorization'] = token;
    }

    return headers;
  },

  // Handle logout
  logout: () => {
    // Clear all possible token storage locations
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/login';
  },

  // Debug authentication state
  debugAuth: () => {
    console.group('🔍 Authentication Debug');
    console.log('Token:', AuthUtils.getToken());
    console.log('User:', AuthUtils.getUser());
    console.log('Is Authenticated:', AuthUtils.isAuthenticated());
    console.log('Auth Headers:', AuthUtils.getAuthHeaders());
    console.log('All localStorage:', { ...localStorage });
    console.log('All sessionStorage:', { ...sessionStorage });
    console.log('Document cookies:', document.cookie);
    console.groupEnd();
  }
};

// Enhanced fetch wrapper with authentication
const authenticatedFetch = async (url, options = {}) => {
  const defaultOptions = {
    method: 'GET',
    credentials: 'include',
    headers: AuthUtils.getAuthHeaders(),
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    // Handle authentication errors
    if (response.status === 401) {
      console.error('❌ 401 Unauthorized - Token may be expired or invalid');
      
      // Optional: Show user-friendly message and redirect to login
      if (window.toast) {
        toast.error('Session expired. Please log in again.');
      }
      
      // Uncomment to auto-logout on 401
      // AuthUtils.logout();
      
      throw new Error('Unauthorized - Please log in again');
    }
    
    if (response.status === 403) {
      console.error('❌ 403 Forbidden - Insufficient permissions');
      throw new Error('Access denied - Insufficient permissions');
    }

    return response;
  } catch (error) {
    console.error('🚨 Fetch Error:', error);
    throw error;
  }
};

// Export for use in your components
export { AuthUtils, authenticatedFetch };