import React, { useState, useEffect } from 'react';
import API from '../services/api';

type Transaction = {
  _id: string;
  title: string;
  amount: number;
  category: string;
  type: string;
  date: string;
};

type Props = {
  transaction: Transaction;
  onClose: () => void;
  onUpdated: () => void;
};

const EditTransactionModal: React.FC<Props> = ({ transaction, onClose, onUpdated }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount);
      setCategory(transaction.category);
      setType(transaction.type);
      setDate(transaction.date.split('T')[0]);
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.put(`/transaction/${transaction._id}`, {
        title,
        amount,
        category,
        type,
        date,
      });
      onUpdated(); // refresh parent data
    } catch (error) {
      alert('Failed to update transaction');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md w-full space-y-4"
      >
        <h3 className="text-lg font-semibold">Edit Transaction</h3>

        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          className="border p-2 w-full rounded"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          min="0"
          step="0.01"
        />
        <input
          type="text"
          placeholder="Category"
          className="border p-2 w-full rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full rounded"
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTransactionModal;