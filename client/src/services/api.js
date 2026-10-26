const API_BASE = '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('sahayak_token') || null;
    this.activeUser = null;
    try {
      const savedUser = localStorage.getItem('sahayak_user');
      if (savedUser) {
        this.activeUser = JSON.parse(savedUser);
      }
    } catch (e) {
      console.warn('Failed to parse cached user');
    }
  }

  setAuth(token, user) {
    this.token = token;
    this.activeUser = user;
    if (token) localStorage.setItem('sahayak_token', token);
    else localStorage.removeItem('sahayak_token');

    if (user) localStorage.setItem('sahayak_user', JSON.stringify(user));
    else localStorage.removeItem('sahayak_user');
  }

  getHeaders(customHeaders = {}) {
    const headers = { ...customHeaders };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.activeUser?.id) {
      headers['x-demo-user-id'] = this.activeUser.id;
      headers['x-demo-user-role'] = this.activeUser.role;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = this.getHeaders(options.headers || {});

    // If body is FormData, don't set Content-Type header (browser sets boundary)
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error(`[API Error] ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth - Citizen Module
  citizenLogin(email, password) {
    return this.request('/auth/citizen/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  citizenRegister(userData) {
    return this.request('/auth/citizen/register', {
      method: 'POST',
      body: userData
    });
  }

  // Auth - Admin & Official Module
  adminLogin(email, password, badgeId) {
    return this.request('/auth/admin/login', {
      method: 'POST',
      body: { email, password, badgeId }
    });
  }

  // Legacy fallback
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  register(userData) {
    return this.citizenRegister(userData);
  }

  getDemoUsers() {
    return this.request('/auth/demo-users');
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Complaints
  getComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/complaints${query ? `?${query}` : ''}`);
  }

  getComplaint(idOrTrackingId) {
    return this.request(`/complaints/${idOrTrackingId}`);
  }

  createComplaint(complaintData) {
    return this.request('/complaints', {
      method: 'POST',
      body: complaintData
    });
  }

  updateComplaintStatus(id, updateData) {
    return this.request(`/complaints/${id}/status`, {
      method: 'PATCH',
      body: updateData
    });
  }

  assignOfficer(id, officerData) {
    return this.request(`/complaints/${id}/assign`, {
      method: 'PATCH',
      body: officerData
    });
  }

  submitFeedback(id, feedbackData) {
    return this.request(`/complaints/${id}/feedback`, {
      method: 'POST',
      body: feedbackData
    });
  }

  rerouteDepartment(id, rerouteData) {
    return this.request(`/complaints/${id}/reroute`, {
      method: 'PATCH',
      body: rerouteData
    });
  }

  uploadFiles(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    return this.request('/complaints/upload', {
      method: 'POST',
      body: formData
    });
  }

  // Departments
  getDepartments() {
    return this.request('/departments');
  }

  // Analytics
  getAnalytics() {
    return this.request('/analytics');
  }

  // Notifications
  getNotifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/notifications${query ? `?${query}` : ''}`);
  }

  markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  }

  markAllNotificationsRead() {
    return this.request('/notifications/read-all', {
      method: 'POST'
    });
  }
}

export const api = new ApiService();
