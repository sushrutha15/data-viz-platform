import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message = 'Something went wrong', onRetry }) => (
  <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[200px] sm:min-h-[250px]">
    <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mb-2 sm:mb-3" />
    <p className="text-gray-400 text-xs sm:text-sm text-center mb-3 sm:mb-4 max-w-xs sm:max-w-sm lg:max-w-md px-2">
      {message}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center justify-center space-x-2 bg-[#9acd32] text-black px-3 py-2 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-[#8bc34a] transition-colors w-full max-w-[140px] sm:max-w-none sm:w-auto"
      >
        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Try Again</span>
      </button>
    )}
  </div>
);

export default ErrorMessage;