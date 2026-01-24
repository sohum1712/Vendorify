import { authToasts } from "./toast";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001/api";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem("vendorify_token");
  }

  // Remove auth data from localStorage
  clearAuth() {
    localStorage.removeItem("vendorify_token");
    localStorage.removeItem("vendorify_user");
    localStorage.removeItem("vendorify_refresh_token");
    // Clear any other auth-related data that might exist
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('vendorify_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Create request headers
  getHeaders(includeAuth = true) {
    const headers = {
      "Content-Type": "application/json",
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

    // FIXED: Log network requests in development only
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 ${response.url.split('/').pop()} - ${response.url} - ${response.status} - ${response.ok ? 'Success' : data.message}`);
    }

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        this.clearAuth();
        // Only show one notification for 401 errors
        if (data.message?.includes("expired")) {
          // Don't show multiple session expired messages
          if (!this._sessionExpiredShown) {
            this._sessionExpiredShown = true;
            authToasts.sessionExpired();
            // Reset flag after 5 seconds
            setTimeout(() => { this._sessionExpiredShown = false; }, 5000);
          }
        } else {
          // Don't show multiple unauthorized messages
          if (!this._unauthorizedShown) {
            this._unauthorizedShown = true;
            authToasts.unauthorized();
            // Reset flag after 5 seconds
            setTimeout(() => { this._unauthorizedShown = false; }, 5000);
          }
        }
        // Redirect to login page
        window.location.href = "/";
        throw new Error(data.message || "Unauthorized");
      }

      if (response.status === 403) {
        if (!this._forbiddenShown) {
          this._forbiddenShown = true;
          authToasts.unauthorized();
          setTimeout(() => { this._forbiddenShown = false; }, 5000);
        }
        throw new Error(data.message || "Forbidden");
      }

      if (
        response.status === 404 &&
        data.message?.includes("Account not found")
      ) {
        authToasts.userNotFound();
        throw new Error(data.message);
      }

      if (response.status === 401 && data.message?.includes("password")) {
        authToasts.wrongPassword();
        throw new Error(data.message);
      }

      if (response.status === 409 && data.message?.includes("already exists")) {
        authToasts.accountExists();
        throw new Error(data.message);
      }

      if (response.status >= 500) {
        if (!this._serverErrorShown) {
          this._serverErrorShown = true;
          authToasts.serverError();
          setTimeout(() => { this._serverErrorShown = false; }, 5000);
        }
        throw new Error(data.message || "Server error");
      }

      throw new Error(data.message || "Request failed");
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
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        authToasts.networkError();
        throw new Error("Network error. Please check your connection.");
      }
      throw error;
    }
  }

  // HTTP methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  // Authentication specific methods
  async login(credentials) {
    const data = await this.post("/auth/login", credentials, {
      includeAuth: false,
    });
    if (data.success && data.token) {
      localStorage.setItem("vendorify_token", data.token);
      localStorage.setItem("vendorify_user", JSON.stringify(data.user));
      authToasts.loginSuccess(data.user.name);
    }
    return data;
  }

  async register(userData) {
    const data = await this.post("/auth/register", userData, {
      includeAuth: false,
    });
    if (data.success && data.token) {
      localStorage.setItem("vendorify_token", data.token);
      localStorage.setItem("vendorify_user", JSON.stringify(data.user));
      authToasts.registerSuccess(data.user.name);
    }
    return data;
  }

  async logout() {
    try {
      // Prevent multiple logout calls
      if (this._loggingOut) return;
      this._loggingOut = true;
      
      await this.post("/auth/logout");
    } catch (error) {
      // Continue with logout even if API call fails
      if (process.env.NODE_ENV === 'development') {
        console.warn("Logout API call failed:", error);
      }
    } finally {
      this.clearAuth();
      // Only show logout success if not already shown
      if (!this._logoutShown) {
        this._logoutShown = true;
        authToasts.logoutSuccess();
        setTimeout(() => { 
          this._logoutShown = false; 
          this._loggingOut = false;
        }, 2000);
      }
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.get("/auth/me");
      return response;
    } catch (error) {
      // If getCurrentUser fails, it means the token is invalid
      if (process.env.NODE_ENV === 'development') {
        console.debug('getCurrentUser failed, clearing auth data:', error.message);
      }
      this.clearAuth();
      throw error;
    }
  }

  // Test if current token is valid
  async testToken() {
    const token = this.getToken();
    if (!token) {
      return { valid: false, reason: 'No token found' };
    }

    try {
      const response = await this.getCurrentUser();
      return { valid: true, user: response.user };
    } catch (error) {
      return { valid: false, reason: error.message };
    }
  }

  // Vendor-specific API methods
  async getVendorProfile() {
    return this.get('/vendors/profile');
  }

  async getVendorStats() {
    return this.get('/vendors/dashboard/stats');
  }

  async updateVendorProfile(profileData) {
    return this.put('/vendors/profile', profileData);
  }

  async toggleVendorStatus(isOnline) {
    return this.post('/vendors/dashboard/toggle-status', { isOnline });
  }

  async uploadShopPhoto(formData) {
    return this.request('/vendors/upload/shop-photo', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });
  }

  async addVendorProduct(productData) {
    const response = await this.post('/vendors/products', productData);
    // FIXED: Handle new response format
    return response.success ? response.product : response;
  }

  async getVendorProducts() {
    const response = await this.get('/vendors/products');
    // FIXED: Handle new response format
    return response.success ? response.products : response;
  }

  async deleteVendorProduct(productId) {
    return this.delete(`/vendors/products/${productId}`);
  }

  async updateLiveLocation(latitude, longitude) {
    return this.post('/vendors/location/live', { latitude, longitude });
  }

  // Roaming vendor methods
  async setRoamingSchedule(scheduleData) {
    return this.post('/vendors/roaming/schedule', scheduleData);
  }

  async updateRoamingLocation(locationData) {
    return this.post('/vendors/roaming/location', locationData);
  }

  async completeStop(stopData) {
    return this.post('/vendors/roaming/complete-stop', stopData);
  }

  async getRoamingVendors(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.lat && params.lng) {
      queryParams.append('lat', params.lat);
      queryParams.append('lng', params.lng);
    }
    
    if (params.radius) {
      queryParams.append('radius', params.radius);
    }

    const queryString = queryParams.toString();
    const url = `/public/vendors/roaming${queryString ? `?${queryString}` : ''}`;
    
    return this.get(url, { includeAuth: false });
  }

  async getRoamingVendorRoute(vendorId) {
    return this.get(`/public/vendors/roaming/${vendorId}/route`, { includeAuth: false });
  }

  // Reverse geocoding using backend proxy to OpenStreetMap Nominatim
  async reverseGeocode(lat, lon) {
    try {
      const response = await this.get(
        `/public/vendors/reverse-geocode?lat=${lat}&lon=${lon}`,
      );

      // Handle the rate limit response format from the server
      if (
        response.success === false &&
        response.message?.includes("Too many requests")
      ) {
        return {
          place: "Service temporarily unavailable",
          district: "Please try again later",
          state: "Rate limit exceeded",
          country: "India",
          fullAddress: "Location service temporarily unavailable",
          rateLimited: true,
        };
      }

      return response;
    } catch (error) {
      console.error("Reverse geocoding error:", error);

      // Check if it's a rate limit error
      if (
        error.message?.includes("Too many requests") ||
        error.message?.includes("429")
      ) {
        return {
          place: "Service temporarily unavailable",
          district: "Please try again later",
          state: "Rate limit exceeded",
          country: "India",
          fullAddress: "Location service temporarily unavailable",
          rateLimited: true,
        };
      }

      return {
        place: "Unknown Area",
        district: "Unknown District",
        state: "Unknown State",
        country: "Unknown Country",
        fullAddress: "Location unavailable",
      };
    }
  }

  // Public vendor methods
  async getNearbyVendors(lat, lng, radius = 5000, category = 'all') {
    return this.get(`/public/vendors/nearby?lat=${lat}&lng=${lng}&radius=${radius}&category=${category}`, { includeAuth: false });
  }

  async searchVendors(query, category, lat, lng) {
    const params = new URLSearchParams({ q: query });
    if (category) params.append('category', category);
    if (lat && lng) {
      params.append('lat', lat);
      params.append('lng', lng);
    }
    return this.get(`/public/vendors/search?${params}`, { includeAuth: false });
  }

  async getRoamingVendors(lat, lng) {
    let url = '/public/vendors/roaming';
    if (lat && lng) {
      url += `?lat=${lat}&lng=${lng}`;
    }
    return this.get(url, { includeAuth: false });
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;