import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Search, Filter, Calendar, Tag } from 'lucide-react';
import { EventService } from '../services/api';
import { format } from 'date-fns';

// Interface to define the search parameters for the event search form
interface SearchParams {
  eventType?: string;
  sourceAppId?: string;
  startDate?: string;
  endDate?: string;
}

function EventSearch() {
  // State to store the search parameters
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  // Fetch events with the current search parameters using react-query
  const { data: events, isLoading } = useQuery(
    ['events', searchParams],
    () => EventService.searchEvents(searchParams), // API call to search events based on parameters
    { enabled: Object.keys(searchParams).length > 0 } // Only enable the query if there are search parameters
  );

  // Handle form submission for the search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement); // Gather form data
    const params: SearchParams = {};

    // Get the form values and add them to the search params
    const eventType = formData.get('eventType') as string;
    const sourceAppId = formData.get('sourceAppId') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    if (eventType) params.eventType = eventType;
    if (sourceAppId) params.sourceAppId = sourceAppId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    setSearchParams(params); // Update state with the new search parameters
  };

  return (
    <div className="space-y-6">
      {/* Search form container */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Search className="h-5 w-5 mr-2" /> {/* Search icon */}
          Search Events
        </h2>

        {/* Event search form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Event Type input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Tag className="h-4 w-4 inline-block mr-1" /> {/* Tag icon */}
                Event Type
              </label>
              <input
                type="text"
                name="eventType"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., user.login"
              />
            </div>

            {/* Source App input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Filter className="h-4 w-4 inline-block mr-1" /> {/* Filter icon */}
                Source App
              </label>
              <input
                type="text"
                name="sourceAppId"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., auth-service"
              />
            </div>

            {/* Start Date input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Calendar className="h-4 w-4 inline-block mr-1" /> {/* Calendar icon */}
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* End Date input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Calendar className="h-4 w-4 inline-block mr-1" /> {/* Calendar icon */}
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Submit button for search */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search Events
            </button>
          </div>
        </form>
      </div>

      {/* Loading indicator while fetching events */}
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 h-24 rounded-lg"></div>
          ))}
        </div>
      ) : events?.length ? (
        // Render events if they exist
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              {/* Event details display */}
              <div className="flex justify-between items-start">
                <div>
                  {/* Event type badge */}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200">
                    {event.eventType}
                  </span>
                  <p className="mt-2 text-sm text-gray-400">
                    Source: {event.sourceAppId}
                  </p>
                </div>
                <div className="text-right">
                  {/* Timestamp */}
                  <p className="text-sm text-gray-400">
                    {format(new Date(event.timestamp), 'PPpp')} {/* Format timestamp */}
                  </p>
                </div>
              </div>
              {/* Event data display */}
              <div className="mt-4">
                <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
                  {JSON.stringify(event.data, null, 2)} {/* Display event data in formatted JSON */}
                </pre>
              </div>
            </div>
          ))}
        </div>
      ) : searchParams.eventType || searchParams.sourceAppId ? (
        // Display message if no events match search criteria
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center text-gray-400">
          No events found matching your search criteria
        </div>
      ) : null}
    </div>
  );
}

export default EventSearch;
