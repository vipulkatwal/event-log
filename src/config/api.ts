const isProduction = import.meta.env.MODE === "production";

const API_BASE_URL = isProduction
  ? "https://event-chain-chi.vercel.app"
  : "http://localhost:3000";

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  wsUrl: API_BASE_URL,
  endpoints: {
    events: "/api/events",
  },
} as const;
