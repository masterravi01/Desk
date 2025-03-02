export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  DASHBOARD: {
    GET_STATS: '/dashboard/stats',
    GET_REPORTS: '/dashboard/reports',
  },
  GET_ALL_USERS: 'user/get-all-users',
};
