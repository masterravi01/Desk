export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: '/dashboard',
  USERS: {
    LIST: '/users',
    DETAILS: (id: string) => `/users/${id}`,
  },
  SETTINGS: '/settings',
  PROFILE: '/profile',
};
