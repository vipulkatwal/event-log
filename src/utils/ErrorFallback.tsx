import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;  // The error object containing the error details
  resetErrorBoundary?: () => void;  // A function to reset the error boundary, if provided
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <AlertCircle className="h-6 w-6 text-red-500" />  {/* Icon indicating an error */}
        <h3 className="text-lg font-semibold text-red-500">Error</h3>  {/* Title of the error */}
      </div>
      <p className="text-sm text-red-200 mb-4">{error.message}</p>  {/* Displaying the error message */}
      {resetErrorBoundary && (
        // If resetErrorBoundary function is provided, display the retry button
        <button
          onClick={resetErrorBoundary}  // Calls the resetErrorBoundary function to retry the operation
          className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />  {/* Refresh icon */}
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
