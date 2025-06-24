import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[200px] sm:min-h-[250px]">
    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#9acd32] animate-spin mb-2 sm:mb-3" />
    <p className="text-gray-400 text-xs sm:text-sm lg:text-base text-center max-w-xs sm:max-w-sm lg:max-w-md px-2">
      {message}
    </p>
  </div>
);

export default LoadingSpinner;