import { useState } from 'react';
import API from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/forgot-password', { email });
      setSent(true);
    } catch {
      alert('Failed to send reset link');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      {sent ? (
        <p className="text-green-600">Check your email for the reset link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;