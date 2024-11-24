import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;  // The children components that will be wrapped by the ErrorBoundary
}

interface State {
  hasError: boolean;  // Tracks whether an error has occurred
  error: Error | null;  // Stores the error information if an error has occurred
}

class ErrorBoundary extends Component<Props, State> {
  // Initial state: no error initially
  public state: State = {
    hasError: false,
    error: null
  };

  // Static method to update state based on error occurrence
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };  // Sets error state to true and captures the error
  }

  // Lifecycle method that captures errors and error information
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You could add error logging service here to log the error
  }

  public render() {
    // If an error has occurred, render the error message and a refresh button
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500" />  {/* Alert icon */}
              <h2 className="text-lg font-semibold text-red-500">Something went wrong</h2>
            </div>
            <p className="mt-4 text-sm text-red-200">
              {this.state.error?.message || 'An unexpected error occurred'}  {/* Display error message */}
            </p>
            <button
              onClick={() => window.location.reload()}  // Refreshes the page upon button click
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // If no error, render the children components
    return this.props.children;
  }
}

export default ErrorBoundary;
