import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post(`/reset-password/${token}`, { password });
      alert('Password reset successful');
      navigate('/login', { replace: true });
    } catch {
      alert('Invalid or expired link');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;