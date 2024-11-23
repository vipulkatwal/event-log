// Import required dependencies and components
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
      staleTime: 5000,              // Data considered fresh for 5 seconds
      cacheTime: 300000,            // Cache persists for 5 minutes
      suspense: false,
      useErrorBoundary: true
    },
    mutations: {
      useErrorBoundary: true
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
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out flex items-center ${
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
    }`}
  >
    <Icon className="inline-block mr-2 h-4 w-4" />
    {label}
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
                    className="h-16 hover:opacity-85 transition-opacity"
                  />
                </div>
                {/* Navigation tabs */}
                <div className="flex space-x-2">
                  <TabButton
                    label="Events"
                    icon={Database}
                    isActive={activeTab === 'events'}
                    onClick={() => setActiveTab('events')}
                  />
                  <TabButton
                    label="Search"
                    icon={Search}
                    isActive={activeTab === 'search'}
                    onClick={() => setActiveTab('search')}
                  />
                  <TabButton
                    label="Dashboard"
                    icon={BarChart}
                    isActive={activeTab === 'dashboard'}
                    onClick={() => setActiveTab('dashboard')}
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
                <EventSimulator />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <EventList />
                  </div>
                  <div>
                    <RealTimeEvents />
                  </div>
                </div>
              </div>
            )}
            {/* Search tab view */}
            {activeTab === 'search' && (
              <div className="animate-fadeIn">
                <EventSearch />
              </div>
            )}
            {/* Dashboard tab view */}
            {activeTab === 'dashboard' && (
              <div className="animate-fadeIn">
                <Dashboard />
              </div>
            )}
          </main>
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;