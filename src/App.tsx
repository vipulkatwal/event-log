import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Activity, Search, Database, BarChart } from 'lucide-react';
import EventList from './components/EventList';
import EventSearch from './components/EventSearch';
import Dashboard from './components/Dashboard';
import RealTimeEvents from './components/RealTimeEvents';
import EventSimulator from './components/EventSimulator';
import ErrorBoundary from './utils/ErrorBoundary';
import appLogo from './assets/event-chain.png';

// Configure React Query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                      // Retry failed queries once
      refetchOnWindowFocus: false,   // Don't refetch when window regains focus
      staleTime: 5000,               // Data considered fresh for 5 seconds
      cacheTime: 300000,             // Cache persists for 5 minutes
      suspense: false,               // Disable suspense
      useErrorBoundary: true         // Enable error boundary for queries
    },
    mutations: {
      useErrorBoundary: true         // Enable error boundary for mutations
    }
  }
});

// TabButton component for navigation
const TabButton = ({
  label,
  icon: Icon,
  isActive,
  onClick
}: {
  label: string;                 // Label for the tab button
  icon: React.ElementType;       // Icon component for the tab
  isActive: boolean;             // Whether the tab is active
  onClick: () => void;           // Function to handle tab click
}) => (
  <button
    onClick={onClick}  // Trigger the onClick handler when the tab is clicked
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out flex items-center ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'  // Styles for active tab
        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'  // Styles for inactive tab
    }`}
  >
    <Icon className="inline-block mr-2 h-4 w-4" />  {/* Icon for the tab */}
    {label}  {/* Tab label */}
  </button>
);

function App() {
  // State to manage active tab
  const [activeTab, setActiveTab] = React.useState<'events' | 'search' | 'dashboard'>('events');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          {/* Navigation header */}
          <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo section */}
                <div className="flex items-center">
                  <img
                    src={appLogo}
                    alt="EventChain Logo"
                    className="h-16 hover:opacity-85 transition-opacity"  // Logo with hover effect
                  />
                </div>
                {/* Navigation tabs */}
                <div className="flex space-x-2">
                  <TabButton
                    label="Events"
                    icon={Database}
                    isActive={activeTab === 'events'}  // Check if the Events tab is active
                    onClick={() => setActiveTab('events')}  // Set the active tab to 'events'
                  />
                  <TabButton
                    label="Search"
                    icon={Search}
                    isActive={activeTab === 'search'}  // Check if the Search tab is active
                    onClick={() => setActiveTab('search')}  // Set the active tab to 'search'
                  />
                  <TabButton
                    label="Dashboard"
                    icon={BarChart}
                    isActive={activeTab === 'dashboard'}  // Check if the Dashboard tab is active
                    onClick={() => setActiveTab('dashboard')}  // Set the active tab to 'dashboard'
                  />
                </div>
              </div>
            </div>
          </nav>

          {/* Main content area */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Events tab view */}
            {activeTab === 'events' && (
              <div className="space-y-8 animate-fadeIn">
                <EventSimulator />  {/* Simulate events */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <EventList />  {/* Display the list of events */}
                  </div>
                  <div>
                    <RealTimeEvents />  {/* Display real-time events */}
                  </div>
                </div>
              </div>
            )}
            {/* Search tab view */}
            {activeTab === 'search' && (
              <div className="animate-fadeIn">
                <EventSearch />  {/* Search for events */}
              </div>
            )}
            {/* Dashboard tab view */}
            {activeTab === 'dashboard' && (
              <div className="animate-fadeIn">
                <Dashboard />  {/* Display the dashboard */}
              </div>
            )}
          </main>
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
