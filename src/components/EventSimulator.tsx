import React, { useState, useEffect } from 'react';
import { Play, Plus } from 'lucide-react';
import { EventService } from '../services/api';
import { useMutation, useQueryClient } from 'react-query';

// Define possible event types and source apps
const EVENT_TYPES = [
  'user.login',
  'user.logout',
  'data.create',
  'data.update',
  'data.delete',
  'system.error',
  'system.warning',
  'api.request',
  'api.response',
  'payment.success'
];

const SOURCE_APPS = [
  'auth-service',
  'payment-service',
  'user-service',
  'data-service',
  'api-gateway'
];

function EventSimulator() {
  // State to track simulation status and interval reference
  const [isSimulating, setIsSimulating] = useState(false);
  const [interval, setInterval] = useState<NodeJS.Timeout | null>(null);

  // React Query Client for handling server-side queries
  const queryClient = useQueryClient();

  // Mutation for creating events and triggering refetch on success
  const { mutate: createEvent } = useMutation(
    (eventData: any) => EventService.createEvent(eventData),
    {
      onSuccess: () => {
        // Invalidate the event query to refresh the event list
        queryClient.invalidateQueries('events');
      }
    }
  );

  // Function to generate a random event
  const generateRandomEvent = () => {
    // Randomly select an event type and source app
    const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
    const sourceAppId = SOURCE_APPS[Math.floor(Math.random() * SOURCE_APPS.length)];

    // Generate mock event data
    const data = {
      userId: `user_${Math.floor(Math.random() * 1000)}`, // Random user ID
      action: eventType.split('.')[1], // Extract action from event type (e.g., "login")
      status: Math.random() > 0.1 ? 'success' : 'error', // Random success/error status
      metadata: {
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, // Random IP address
        userAgent: 'Mozilla/5.0', // Static user agent
        region: ['US', 'EU', 'ASIA'][Math.floor(Math.random() * 3)] // Random region
      }
    };

    return { eventType, sourceAppId, data }; // Return the generated event data
  };

  // Function to create an event when the "Generate Event" button is clicked
  const handleCreateEvent = () => {
    createEvent(generateRandomEvent());
  };

  // Function to toggle event simulation on/off
  const toggleSimulation = () => {
    if (isSimulating) {
      // Stop the simulation and clear the interval
      if (interval) clearInterval(interval);
      setInterval(null);
    } else {
      // Start the simulation and create events every 2 seconds
      const newInterval = setInterval(() => {
        createEvent(generateRandomEvent());
      }, 2000);
      setInterval(newInterval);
    }
    setIsSimulating(!isSimulating); // Toggle simulation state
  };

  // Cleanup interval when component is unmounted or when the simulation is stopped
  useEffect(() => {
    return () => {
      if (interval) clearInterval(interval); // Clear the interval on component unmount
    };
  }, [interval]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Event Simulator</h3>
      <div className="flex space-x-4">
        {/* Button to manually generate a single event */}
        <button
          onClick={handleCreateEvent}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate Event
        </button>

        {/* Button to toggle event simulation on/off */}
        <button
          onClick={toggleSimulation}
          className={`flex items-center px-4 py-2 ${isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md`}
        >
          <Play className="h-4 w-4 mr-2" />
          {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
        </button>
      </div>
    </div>
  );
}

export default EventSimulator;
