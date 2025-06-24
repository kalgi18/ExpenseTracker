import React, { useState } from 'react';
import API from '../services/api';

const TransactionForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/transaction', {
        ...form,
        amount: Number(form.amount),
      });
      setForm({ title: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().slice(0, 10) });
      onSuccess();
    } catch (err) {
      alert('Failed to add transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" placeholder="Title" onChange={handleChange} value={form.title}
        className="w-full border p-2 rounded" required />
      
      <input name="amount" placeholder="Amount" type="number" onChange={handleChange}
        value={form.amount} className="w-full border p-2 rounded" required />
      
      <select name="type" onChange={handleChange} value={form.type}
        className="w-full border p-2 rounded">
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input name="category" placeholder="Category" onChange={handleChange}
        value={form.category} className="w-full border p-2 rounded" required />

      <input name="date" type="date" onChange={handleChange}
        value={form.date} className="w-full border p-2 rounded" required />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;