const DEFAULT_API_URL = 'http://localhost:3000';

// Helper function to ensure WebSocket URL uses correct protocol
const getWebSocketUrl = (url: string) => {
  const wsUrl = url.replace(/^http/, 'ws');
  return wsUrl.endsWith('/') ? wsUrl : `${wsUrl}/`;
};

// Get base URL from environment or default
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || DEFAULT_API_URL;

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  wsUrl: getWebSocketUrl(API_BASE_URL),
  endpoints: {
    events: '/api/events',
    search: '/api/events/search'
  },
  socketOptions: {
    path: "/socket.io/",
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    autoConnect: true,
  }
} as const;

// Type definitions
export interface ApiEndpoints {
  events: string;
  search: string;
}

export interface SocketOptions {
  path: string;
  transports: string[];
  reconnectionAttempts: number;
  reconnectionDelay: number;
  timeout: number;
  autoConnect: boolean;
}

export interface ApiConfig {
  baseUrl: string;
  wsUrl: string;
  endpoints: ApiEndpoints;
  socketOptions: SocketOptions;
}