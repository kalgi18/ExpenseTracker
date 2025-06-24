import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
// import jwt_decode from "jwt-decode";
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted with:", email, password);
    try {
      const res = await API.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await API.post('/auth/google-login', {
        token: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-400">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert('Google login failed')}
          />
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don't have an account?{' '}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-4 text-center">
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot password?
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;