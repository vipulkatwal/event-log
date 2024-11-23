import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Bell, AlertCircle } from 'lucide-react';
import { API_CONFIG } from '../config/api';

// Define the structure of the event data
interface Event {
  _id: string;
  eventType: string;
  timestamp: string;
  sourceAppId: string;
}

function RealTimeEvents() {
  // State to hold the most recent events, error messages, and socket connection
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Effect hook to manage the socket connection and event listeners
  useEffect(() => {
    // Initialize the socket connection to the WebSocket server
    const newSocket = io(API_CONFIG.wsUrl, {
      reconnectionAttempts: 5,  // Try reconnecting 5 times on failure
      reconnectionDelay: 1000,  // 1-second delay between reconnection attempts
      timeout: 10000            // Timeout after 10 seconds if unable to connect
    });

    // Handle successful connection
    newSocket.on('connect', () => {
      setError(null);  // Clear any existing error message on successful connection
    });

    // Handle connection failure
    newSocket.on('connect_error', () => {
      setError('Unable to connect to real-time updates');  // Set error message if connection fails
    });

    // Listen for 'newEvent' from the server and update the event list
    newSocket.on('newEvent', (event: Event) => {
      setRecentEvents((prev) => [event, ...prev].slice(0, 10));  // Add new event at the top and limit the list to 10 events
    });

    // Save socket instance to state for cleanup
    setSocket(newSocket);

    // Cleanup function to disconnect socket when the component is unmounted
    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array means this effect runs only once on component mount

  // If there is an error, display an error message
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
        {/* Render each event in the list of recent events */}
        {recentEvents.map((event) => (
          <div
            key={event._id}
            className="bg-gray-900 rounded p-3 border border-gray-700"
          >
            <div className="flex justify-between items-start">
              {/* Display the event type */}
              <span className="text-sm font-medium text-indigo-400">
                {event.eventType}
              </span>
              {/* Display the event timestamp */}
              <span className="text-xs text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
            {/* Display the source application of the event */}
            <p className="text-xs text-gray-400 mt-1">{event.sourceAppId}</p>
          </div>
        ))}
        {/* If no events have been received, show a waiting message */}
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
