import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock } from 'lucide-react';
import LoadingSpinner from './LoadSpinner';
import ErrorMessage from './ErrorMessage';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Demo authentication
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password123') {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use demo@example.com / password123');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-[#161618] border border-[#3b3b3b] rounded-lg p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg">
        
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-[#9acd32]" />
            <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">
              <span className="hidden sm:inline">Charging Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 sm:mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          
          {/* Email Field */}
          <div>
            <label className="block text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 lg:py-3 bg-[#242424] border border-[#3a3a3a] rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#9acd32] text-sm sm:text-base transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 lg:py-3 bg-[#242424] border border-[#3a3a3a] rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#9acd32] text-sm sm:text-base transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#9acd32] text-black py-2 sm:py-2.5 lg:py-3 px-4 rounded font-medium hover:bg-[#8bc34a] transition-colors disabled:opacity-50 text-sm sm:text-base lg:text-lg mt-4 sm:mt-6"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner message="" />
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            <span className="block sm:inline">Demo: </span>
            <span className="font-mono text-[#9acd32] text-xs sm:text-sm">
              demo@example.com / password123
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;