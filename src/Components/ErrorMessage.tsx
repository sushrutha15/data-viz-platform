import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message = 'Something went wrong', onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
    <p className="text-gray-400 text-sm mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center space-x-2 bg-[#9acd32] text-black px-4 py-2 rounded text-sm hover:bg-[#8bc34a] transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    )}
  </div>
);

export default ErrorMessage;
