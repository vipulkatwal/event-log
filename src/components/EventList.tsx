import React from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { CheckCircle, AlertCircle, Clock, Loader, Clipboard } from 'lucide-react';
import { EventService } from '../services/api';
import ErrorFallback from '../utils/ErrorFallback';

// Define the Event interface with the expected structure of event data
interface Event {
  _id: string;
  eventType: string;
  timestamp: string;
  sourceAppId: string;
  data: any;
  hash: string;
  previousHash: string;
}

function EventList() {
  // Fetch events using react-query with error handling, retry, and refetch capabilities
  const { data: events, isLoading, error, refetch } = useQuery<Event[], Error>(
    'events',
    EventService.getEvents, // Fetching data from the EventService
    {
      retry: 3, // Retry fetching up to 3 times on failure
      retryDelay: 1000, // Retry delay of 1 second
      onError: (error) => {
        console.error('Failed to fetch events:', error); // Log any errors
      }
    }
  );

  // Event type colors mapping based on the event type
  const eventTypeColors: Record<string, string> = {
    error: 'bg-red-900 text-red-200',
    info: 'bg-blue-900 text-blue-200',
    warning: 'bg-yellow-900 text-yellow-200',
    success: 'bg-green-900 text-green-200',
  };

  // Function to copy the event hash to clipboard
  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader className="h-8 w-8 text-indigo-500 animate-spin" /> {/* Loading spinner */}
        <p className="text-gray-400">Loading events...</p>
      </div>
    );
  }

  // Render error fallback if there is an error
  if (error) {
    return (
      <ErrorFallback
        error={error}
        resetErrorBoundary={() => refetch()} // Reset error and refetch events on click
      />
    );
  }

  // Render message when no events are found
  if (!events?.length) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
        <p className="text-gray-400">No events found. Try generating some events using the simulator.</p>
      </div>
    );
  }

  // Render the list of events
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Event Log Chain</h2>

      {events.map((event) => (
        <div
          key={event._id}
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-indigo-500 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              {/* Event type badge with dynamic color based on event type */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${eventTypeColors[event.eventType] || 'bg-gray-900 text-gray-200'}`}>
                {event.eventType}
              </span>
              <p className="mt-2 text-sm text-gray-400">
                Source: {event.sourceAppId} {/* Display source of the event */}
              </p>
            </div>
            <div className="text-right">
              {/* Display timestamp */}
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {format(new Date(event.timestamp), 'PPpp')} {/* Format timestamp */}
              </div>
              {/* Verified status indicator */}
              <div className="mt-2 flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified
              </div>
            </div>
          </div>
          <div className="mt-4">
            {/* Display event data in JSON format */}
            <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
              {JSON.stringify(event.data, null, 2)}
            </pre>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            {/* Display hash and previous hash */}
            <p className="text-xs text-gray-500 font-mono flex items-center">
              Hash: {event.hash.substring(0, 20)}... {/* Truncated hash */}
              {/* Clipboard icon to copy the hash */}
              <Clipboard
                className="w-4 h-4 ml-2 cursor-pointer text-indigo-500"
                onClick={() => copyToClipboard(event.hash)} // Copy hash to clipboard
              />
            </p>
            <p className="text-xs text-gray-500 font-mono">
              Previous: {event.previousHash.substring(0, 20)}... {/* Truncated previous hash */}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventList;
