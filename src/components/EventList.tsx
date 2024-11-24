import React from 'react';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { CheckCircle, AlertCircle, Clock, Loader } from 'lucide-react';
import { EventService } from '../services/api';
import ErrorFallback from '../utils/ErrorFallback';

interface Event {
  _id: string; // Unique identifier for the event
  eventType: string; // Type/category of the event
  timestamp: string; // Event occurrence time
  sourceAppId: string; // Source application generating the event
  data: any; // Additional data associated with the event
  hash: string; // Current hash for the event (used in blockchain-like systems)
  previousHash: string; // Hash of the previous event in the chain
}

function EventList() {
  // Fetches the event data using the `useQuery` hook from react-query
  const { data: events, isLoading, error, refetch } = useQuery<Event[], Error>(
    'events',
    EventService.getEvents,
    {
      retry: 3, // Number of retry attempts in case of failure
      retryDelay: 1000, // Delay between retry attempts
      onError: (error) => {
        // Logs error if fetching fails
        console.error('Failed to fetch events:', error);
      }
    }
  );

  // Displays a loading state while the data is being fetched
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-gray-400">Loading events...</p>
      </div>
    );
  }

  // Displays an error state and allows retrying in case of a fetch error
  if (error) {
    return (
      <ErrorFallback
        error={error}
        resetErrorBoundary={() => refetch()}
      />
    );
  }

  // Displays a message when no events are available
  if (!events?.length) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
        <p className="text-gray-400">No events found. Try generating some events using the simulator.</p>
      </div>
    );
  }

  // Main rendering of the event list
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Event Log Chain</h2>
      {events.map((event) => (
        <div
          key={event._id} // Ensures each event has a unique key for React rendering
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-indigo-500 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200">
                {event.eventType} {/* Displays the event type */}
              </span>
              <p className="mt-2 text-sm text-gray-400">
                Source: {event.sourceAppId} {/* Displays the source application ID */}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {format(new Date(event.timestamp), 'PPpp')} {/* Formats the event timestamp */}
              </div>
              <div className="mt-2 flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified {/* Indicates the event is verified */}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
              {JSON.stringify(event.data, null, 2)} {/* Displays the event's additional data */}
            </pre>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            {/* Displays hash and previous hash values truncated for readability */}
            <p className="text-xs text-gray-500 font-mono">
              Hash: {event.hash.substring(0, 20)}...
            </p>
            <p className="text-xs text-gray-500 font-mono">
              Previous: {event.previousHash.substring(0, 20)}...
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventList;
