import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';
import type { Event } from '../types/event';

// Interface to define the shape of search query parameters
interface SearchParams {
  eventType?: string;
  sourceAppId?: string;
  startDate?: string;
  endDate?: string;
}

// Custom error class to handle API-related errors
class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';  // Set custom error name
  }
}

// Creating an axios instance with default configuration
const api = axios.create({
  baseURL: API_CONFIG.baseUrl,  // API base URL from configuration
  timeout: 10000,  // Timeout for requests (10 seconds)
  headers: {
    'Content-Type': 'application/json'  // Default content type
  }
});

// Helper function to handle API errors uniformly
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      // No response from the server
      throw new ApiError(
        'Unable to connect to the server. Please ensure the server is running.'
      );
    }
    // API response error
    throw new ApiError(
      error.response.data?.message || 'An error occurred while processing your request',  // Error message
      error.response.status  // HTTP status code
    );
  }
  // Unexpected errors (e.g., network issues)
  throw new ApiError('An unexpected error occurred');
};

// Exporting the EventService with different API methods
export const EventService = {
  // Method to get all events
  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get<Event[]>(API_CONFIG.endpoints.events);  // Sending GET request to fetch events
      return response.data;  // Returning the response data
    } catch (error) {
      throw handleApiError(error);  // Handling any errors
    }
  },

  // Method to create a new event
  createEvent: async (eventData: Partial<Event>): Promise<Event> => {
    try {
      const response = await api.post<Event>(API_CONFIG.endpoints.events, eventData);  // Sending POST request to create event
      return response.data;  // Returning the newly created event
    } catch (error) {
      throw handleApiError(error);  // Handling any errors
    }
  },

  // Method to search events with query parameters
  searchEvents: async (params: SearchParams): Promise<Event[]> => {
    try {
      const response = await api.get<Event[]>(API_CONFIG.endpoints.search, { params });  // Sending GET request with query params
      return response.data;  // Returning the filtered events
    } catch (error) {
      throw handleApiError(error);  // Handling any errors
    }
  }
};
