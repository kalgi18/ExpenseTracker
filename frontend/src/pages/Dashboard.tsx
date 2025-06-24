import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from '../components/Chart';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import EditTransactionModal from '../components/EditTransactionModal';
import API from '../services/api';

type Transaction = {
  _id: string;
  title: string;
  amount: number;
  category: string;
  type: string;
  date: string;
};

const Dashboard: React.FC = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    } catch {
      alert('Failed to load transactions');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  //handles logout
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseModal = () => {
    setEditingTransaction(null);
  };

  const handleUpdated = () => {
    fetchTransactions();
    setEditingTransaction(null);
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center flex-grow">
          Expense Tracker Dashboard
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/profile')}
            className="px-3 py-1 underline-offset-4 hover:underline cursor-pointer"
          >
            View Profile
          </button>
          <button
            type="submit"
            onClick={handleLogout}
            className="px-3 py-1 underline-offset-4 hover:underline cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 bg-white p-4 rounded-xl shadow">
          <Chart
            selectedMonth={month}
            selectedYear={year}
            onMonthChange={(e) => setMonth(Number(e.target.value))}
            onYearChange={(e) => setYear(Number(e.target.value))}
            transactions={transactions}
          />
        </div>
        <div className="md:w-1/3 bg-white p-4 rounded-xl shadow">
          <TransactionForm onSuccess={fetchTransactions} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <TransactionList
          transactions={transactions}
          month={month}
          year={year}
          onRefresh={fetchTransactions}
          onEdit={handleEdit}
        />

        {editingTransaction && (
          <EditTransactionModal
            transaction={editingTransaction}
            onClose={handleCloseModal}
            onUpdated={handleUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;