// Authentication utilities
export const auth = {
  // Check if user appears to be logged in (from localStorage flag)
  isLoggedIn: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_logged_in') === 'true';
    }
    return false;
  },

  // Get token from localStorage (for fallback cases)
  getToken: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('clinic_token');
      return (token && token.trim() !== '') ? token : null;
    }
    return null;
  },

  // Set login state
  setLoggedIn: (isLoggedIn = true) => {
    if (typeof window !== 'undefined') {
      if (isLoggedIn) {
        localStorage.setItem('user_logged_in', 'true');
      } else {
        localStorage.removeItem('user_logged_in');
      }
    }
  },

  // Set token in localStorage (fallback)
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clinic_token', token);
    }
  },

  // Remove all auth data
  removeAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clinic_token');
      localStorage.removeItem('user_logged_in');
    }
  },

  // Verify authentication with server (for HttpOnly cookies)
  verifyAuth: async () => {
    try {
      const response = await fetch('http://localhost:8080/api/clinic/auth/verify', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Auth verification failed:', error);
      return false;
    }
  }
};

// API utilities
export const api = {
  baseURL: 'http://localhost:8080/api/clinic',

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${api.baseURL}/auth/login`, {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  // Register new clinic
  register: async (registrationData) => {
    const response = await fetch(`${api.baseURL}/auth/register`, {
      method: 'POST',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  // Make authenticated API call
  authenticatedFetch: async (endpoint, options = {}) => {
    const token = auth.getToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${api.baseURL}${endpoint}`, config);

    if (response.status === 401) {
      // Token is invalid, remove it and redirect to login
      auth.removeToken();
      window.location.href = '/auth/login';
      return;
    }

    return response;
  }
};

// Form validation utilities
export const validation = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    return password.length >= 6;
  },

  contactNumber: (number) => {
    return /^\d{11}$/.test(number);
  },

  required: (value) => {
    return value && value.trim().length > 0;
  }
};