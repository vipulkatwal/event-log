import React from 'react';
import { useQuery } from 'react-query';
import { BarChart as BarChartIcon, PieChart, Activity, Server } from 'lucide-react';
import { EventService } from '../services/api';

function Dashboard() {
  // Fetch events data using react-query
  const { data: events } = useQuery('events', EventService.getEvents);

  // Calculate the count of each event type
  const eventTypeCount = events?.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Calculate the count of each source application
  const sourceAppCount = events?.reduce((acc, event) => {
    acc[event.sourceAppId] = (acc[event.sourceAppId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">System Dashboard</h2>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Events</p>
              <p className="text-2xl font-semibold text-white">{events?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Unique Event Types */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <BarChartIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Event Types</p>
              <p className="text-2xl font-semibold text-white">
                {Object.keys(eventTypeCount).length}
              </p>
            </div>
          </div>
        </div>

        {/* Unique Source Applications */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <Server className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Source Apps</p>
              <p className="text-2xl font-semibold text-white">
                {Object.keys(sourceAppCount).length}
              </p>
            </div>
          </div>
        </div>

        {/* Chain Length */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Chain Length</p>
              <p className="text-2xl font-semibold text-white">{events?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Types Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Event Types Distribution</h3>
          <div className="space-y-4">
            {Object.entries(eventTypeCount).map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>{type}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{
                      width: `${(count / (events?.length || 1)) * 100}%`, // Calculate percentage width
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Applications Distribution */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Source Applications</h3>
          <div className="space-y-4">
            {Object.entries(sourceAppCount).map(([source, count]) => (
              <div key={source}>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>{source}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 rounded-full h-2"
                    style={{
                      width: `${(count / (events?.length || 1)) * 100}%`, // Calculate percentage width
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
