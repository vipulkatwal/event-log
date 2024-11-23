import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';
import type { Event } from '../types/event';

interface SearchParams {
  eventType?: string;
  sourceAppId?: string;
  startDate?: string;
  endDate?: string;
}

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      throw new ApiError(
        'Unable to connect to the server. Please ensure the server is running.'
      );
    }
    throw new ApiError(
      error.response.data?.message || 'An error occurred while processing your request',
      error.response.status
    );
  }
  throw new ApiError('An unexpected error occurred');
};

export const EventService = {
  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get<Event[]>(API_CONFIG.endpoints.events);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createEvent: async (eventData: Partial<Event>): Promise<Event> => {
    try {
      const response = await api.post<Event>(API_CONFIG.endpoints.events, eventData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  searchEvents: async (params: SearchParams): Promise<Event[]> => {
    try {
      const response = await api.get<Event[]>(API_CONFIG.endpoints.search, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};