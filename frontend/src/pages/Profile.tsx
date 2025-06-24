import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';

type UserInfo = { name: string; email: string };
type Stats = { totalIncome: number; totalExpenditure: number; highestExpense: number; avgMonthlyCost: number };
type MonthlyData = { month: string; income: number; expense: number };

const Profile = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/profile');
      setUser(res.data.user);
      setStats(res.data.stats);
    } catch {
      alert('Failed to load profile data');
    }
  };

  const fetchMonthly = async () => {
    try {
      const res = await API.get('/profile/monthly-summary');
      setMonthlyData(res.data);
    } catch {
      alert('Failed to load monthly chart data');
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMonthly();
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center flex-grow">My Profile</h1>
        <div className="flex space-x-4">
          <button onClick={() => navigate('/dashboard')} className="px-3 py-1 hover:underline">Dashboard</button>
          <button onClick={handleLogout} className="px-3 py-1 hover:underline">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow">
          <table className="table-auto w-full mb-4">
            <tbody>
              <tr><td className="font-medium py-2">Name:</td><td>{user?.name}</td></tr>
              <tr><td className="font-medium py-2">Email:</td><td>{user?.email}</td></tr>
              <tr><td className="font-medium py-2">Password:</td><td>••••••••</td></tr>
            </tbody>
          </table>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
          onClick={() => navigate('/forgot-password')}>Change Password</button>
        </div>

        <div className="md:w-1/2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between"><span>Total Income:</span><span>${stats?.totalIncome}</span></div>
            <div className="flex justify-between"><span>Total Expenditure:</span><span>${stats?.totalExpenditure}</span></div>
            <div className="flex justify-between"><span>Highest Expenditure:</span><span>${stats?.highestExpense}</span></div>
            <div className="flex justify-between"><span>Average Monthly Cost:</span><span>${stats?.avgMonthlyCost}</span></div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expense" fill="#ef4444" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Profile;