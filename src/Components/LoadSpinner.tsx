import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <Loader2 className="w-8 h-8 text-[#9acd32] animate-spin" />
    <p className="text-gray-400 text-sm mt-2">{message}</p>
  </div>
);

export default LoadingSpinner;
