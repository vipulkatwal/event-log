const API_BASE_URL = 'http://localhost:3000';

export const API_CONFIG = {
  baseUrl: import.meta.env?.VITE_API_BASE_URL || API_BASE_URL,
  wsUrl: import.meta.env?.VITE_API_BASE_URL || API_BASE_URL,
  endpoints: {
    events: '/api/events',
    search: '/api/events/search'
  }
} as const;