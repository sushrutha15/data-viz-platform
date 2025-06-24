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

    //demo authentication
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
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="bg-[#161618] border border-[#3b3b3b] rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-8 h-8 text-[#9acd32]" />
            <h1 className="text-white text-2xl font-bold">Charging Dashboard</h1>
          </div>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#242424] border border-[#3a3a3a] rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#9acd32]"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#242424] border border-[#3a3a3a] rounded text-white placeholder-gray-400 focus:outline-none focus:border-[#9acd32]"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#9acd32] text-black py-2 px-4 rounded font-medium hover:bg-[#8bc34a] transition-colors disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner message="" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Demo: demo@example.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
