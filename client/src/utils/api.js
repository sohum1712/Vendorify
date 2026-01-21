import { authToasts } from './toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('vendorify_token');
  }

  // Remove auth data from localStorage
  clearAuth() {
    localStorage.removeItem('vendorify_token');
    localStorage.removeItem('vendorify_user');
  }

  // Create request headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Handle API responses
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        this.clearAuth();
        if (data.message?.includes('expired')) {
          authToasts.sessionExpired();
        } else {
          authToasts.unauthorized();
        }
        // Redirect to login page
        window.location.href = '/';
        throw new Error(data.message || 'Unauthorized');
      }

      if (response.status === 403) {
        authToasts.unauthorized();
        throw new Error(data.message || 'Forbidden');
      }

      if (response.status === 404 && data.message?.includes('Account not found')) {
        authToasts.userNotFound();
        throw new Error(data.message);
      }

      if (response.status === 401 && data.message?.includes('password')) {
        authToasts.wrongPassword();
        throw new Error(data.message);
      }

      if (response.status === 409 && data.message?.includes('already exists')) {
        authToasts.accountExists();
        throw new Error(data.message);
      }

      if (response.status >= 500) {
        authToasts.serverError();
        throw new Error(data.message || 'Server error');
      }

      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        authToasts.networkError();
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  }

  // HTTP methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Authentication specific methods
  async login(credentials) {
    const data = await this.post('/auth/login', credentials, { includeAuth: false });
    if (data.success && data.token) {
      localStorage.setItem('vendorify_token', data.token);
      localStorage.setItem('vendorify_user', JSON.stringify(data.user));
      authToasts.loginSuccess(data.user.name);
    }
    return data;
  }

  async register(userData) {
    const data = await this.post('/auth/register', userData, { includeAuth: false });
    if (data.success && data.token) {
      localStorage.setItem('vendorify_token', data.token);
      localStorage.setItem('vendorify_user', JSON.stringify(data.user));
      authToasts.registerSuccess(data.user.name);
    }
    return data;
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAuth();
      authToasts.logoutSuccess();
    }
  }

  async getCurrentUser() {
    return this.get('/auth/me');
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;