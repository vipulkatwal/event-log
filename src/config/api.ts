const API_BASE_URL = 'http://localhost:3000';

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  wsUrl: API_BASE_URL,
  endpoints: {
    events: '/api/events',
    search: '/api/events/search'
  }
} as const;