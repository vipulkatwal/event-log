import React, { useState } from 'react';
import { Play, Plus } from 'lucide-react';
import { EventService } from '../services/api';
import { useMutation, useQueryClient } from 'react-query';

// Predefined list of event types for simulation
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

// Predefined list of source applications for simulation
const SOURCE_APPS = [
  'auth-service',
  'payment-service',
  'user-service',
  'data-service',
  'api-gateway'
];

function EventSimulator() {
  const [isSimulating, setIsSimulating] = useState(false);  // State to track simulation status
  const queryClient = useQueryClient();  // React Query client to invalidate queries
  const [interval, setInterval] = useState<NodeJS.Timeout | null>(null);  // State to hold interval ID

  // Mutation hook to create an event
  const { mutate: createEvent } = useMutation(
    (eventData: any) => EventService.createEvent(eventData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');  // Invalidate events query after successful event creation
      }
    }
  );

  // Function to generate random event data
  const generateRandomEvent = () => {
    const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];  // Random event type
    const sourceAppId = SOURCE_APPS[Math.floor(Math.random() * SOURCE_APPS.length)];  // Random source app ID

    // Random event data with user action, status, and metadata
    const data = {
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      action: eventType.split('.')[1],  // Action based on event type (e.g., "login")
      status: Math.random() > 0.1 ? 'success' : 'error',  // Random status (success or error)
      metadata: {
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,  // Random IP
        userAgent: 'Mozilla/5.0',  // Placeholder user agent
        region: ['US', 'EU', 'ASIA'][Math.floor(Math.random() * 3)]  // Random region
      }
    };

    return { eventType, sourceAppId, data };  // Return generated event data
  };

  // Handle event creation
  const handleCreateEvent = () => {
    createEvent(generateRandomEvent());  // Trigger mutation to create the event
  };

  // Toggle simulation on/off
  const toggleSimulation = () => {
    if (isSimulating) {
      if (interval) clearInterval(interval);  // Clear interval if simulation is stopped
      setInterval(null);  // Reset interval state
    } else {
      const newInterval = setInterval(() => {
        createEvent(generateRandomEvent());  // Create event every 2 seconds during simulation
      }, 2000);
      setInterval(newInterval);  // Set interval state
    }
    setIsSimulating(!isSimulating);  // Toggle simulation status
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Event Simulator</h3>
      <div className="flex space-x-4">
        {/* Button to generate a single random event */}
        <button
          onClick={handleCreateEvent}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate Event
        </button>

        {/* Button to start/stop simulation */}
        <button
          onClick={toggleSimulation}
          className={`flex items-center px-4 py-2 ${
            isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-md`}
        >
          <Play className="h-4 w-4 mr-2" />
          {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
        </button>
      </div>
    </div>
  );
}

export default EventSimulator;
