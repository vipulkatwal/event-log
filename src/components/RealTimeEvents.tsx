import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Bell, AlertCircle } from 'lucide-react';
import { API_CONFIG } from '../config/api';

// Interface to define the shape of the event data
interface Event {
  _id: string;
  eventType: string;
  timestamp: string;
  sourceAppId: string;
}

function RealTimeEvents() {
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);  // State to store recent events
  const [error, setError] = useState<string | null>(null);  // State to store error messages
  const [socket, setSocket] = useState<Socket | null>(null);  // State to hold the socket instance

  useEffect(() => {
    // Establish a new WebSocket connection
    const newSocket = io(API_CONFIG.wsUrl, {
      reconnectionAttempts: 5,  // Retry 5 times if connection fails
      reconnectionDelay: 1000,  // Retry delay of 1 second
      timeout: 10000  // Connection timeout of 10 seconds
    });

    // Listen for successful connection
    newSocket.on('connect', () => {
      setError(null);  // Reset error state on successful connection
    });

    // Handle connection error
    newSocket.on('connect_error', () => {
      setError('Unable to connect to real-time updates');  // Set error message if connection fails
    });

    // Listen for new events from the server
    newSocket.on('newEvent', (event: Event) => {
      // Add the new event to the beginning of the recent events list, keeping only the 10 most recent
      setRecentEvents((prev) => [event, ...prev].slice(0, 10));
    });

    // Set socket instance
    setSocket(newSocket);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();  // Disconnect the socket on component unmount
    };
  }, []);  // Empty dependency array to run this effect only once on mount

  // If there's an error, display the error message
  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-white">Real-time Events</h3>
        </div>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center mb-4">
        <Bell className="h-5 w-5 text-indigo-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">Real-time Events</h3>
      </div>
      <div className="space-y-3">
        {recentEvents.map((event) => (
          <div
            key={event._id}
            className="bg-gray-900 rounded p-3 border border-gray-700"
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-indigo-400">
                {event.eventType}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}  {/* Format the timestamp */}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{event.sourceAppId}</p>
          </div>
        ))}
        {/* Display a message when there are no recent events */}
        {recentEvents.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            Waiting for new events...
          </p>
        )}
      </div>
    </div>
  );
}

export default RealTimeEvents;
