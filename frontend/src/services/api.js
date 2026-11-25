import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from '../utils/constants';

// Centralized Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error & 401 Unauthorized handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not on login/register endpoints, clear storage
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    return Promise.reject(error);
  }
);

// Authentication Service
export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },
};

// Course Discovery Service
export const courseService = {
  getCourses: async (params = {}) => {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
};

// Enrollment Service
export const enrollmentService = {
  enroll: async (courseId, isDevTestEnrollment = false) => {
    const response = await apiClient.post(`/enrollments/${courseId}`, {
      devTestEnrollment: isDevTestEnrollment,
    });
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await apiClient.get('/enrollments/my-courses');
    return response.data;
  },

  checkEnrollment: async (courseId) => {
    const response = await apiClient.get(`/enrollments/check/${courseId}`);
    return response.data;
  },

  updateProgress: async (courseId, completedLessons) => {
    const response = await apiClient.patch(`/enrollments/${courseId}/progress`, null, {
      params: { completedLessons },
    });
    return response.data;
  },
};

// Wishlist Service
export const wishlistService = {
  getWishlist: async () => {
    const response = await apiClient.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (courseId) => {
    const response = await apiClient.post(`/wishlist/${courseId}`);
    return response.data;
  },

  removeFromWishlist: async (courseId) => {
    const response = await apiClient.delete(`/wishlist/${courseId}`);
    return response.data;
  },
};

// Public Endpoints Service
export const publicService = {
  getHealth: async () => {
    const response = await apiClient.get('/public/health');
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  getFeaturedCourses: async () => {
    const response = await apiClient.get('/public/courses/featured');
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/public/stats');
    return response.data;
  },
};

// Student Service
export const studentService = {
  getDashboard: async () => {
    const response = await apiClient.get('/student/dashboard');
    return response.data;
  },
};

// Instructor Service
export const instructorService = {
  getDashboard: async () => {
    const response = await apiClient.get('/instructor/dashboard');
    return response.data;
  },
};

// Admin Service
export const adminService = {
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
};

export default apiClient;
