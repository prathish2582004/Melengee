export const ROLES = {
  STUDENT: 'ROLE_STUDENT',
  INSTRUCTOR: 'ROLE_INSTRUCTOR',
  ADMIN: 'ROLE_ADMIN',
};

export const ROLE_LABELS = {
  ROLE_STUDENT: 'Student',
  ROLE_INSTRUCTOR: 'Instructor',
  ROLE_ADMIN: 'Administrator',
};

export const DASHBOARD_ROUTES = {
  ROLE_STUDENT: '/dashboard/student',
  ROLE_INSTRUCTOR: '/dashboard/instructor',
  ROLE_ADMIN: '/dashboard/admin',
};

export const TOKEN_KEY = 'melangee_token';
export const USER_KEY = 'melangee_user';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

