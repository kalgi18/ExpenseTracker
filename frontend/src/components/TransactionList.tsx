import React, { useState } from 'react';
import dayjs from 'dayjs';
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
  transactions: Transaction[];
  month: number;
  year: number;
  onRefresh: () => void;
  onEdit: (tx: Transaction) => void;
};

const TransactionList: React.FC<Props> = ({ transactions, month, year, onRefresh, onEdit }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Get unique categories from transactions filtered by month and year
  const categories = Array.from(
    new Set(
      transactions
        .filter(tx => {
          const d = new Date(tx.date);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .map(tx => tx.category)
    )
  );

  // Filter transactions by month, year AND selected category
  const filtered = transactions.filter(tx => {
    const d = dayjs(tx.date);
    const matchesDate = d.year() === year && d.month() === month;
    const matchesCategory = selectedCategory ? tx.category === selectedCategory : true;
    return matchesDate && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/transaction/${id}`);
      onRefresh();
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map(tx => (
            <div
              key={tx._id}
              className="group flex justify-between items-center p-3 border rounded hover:bg-gray-100"
            >
              <div>
                <div className="font-medium">
                  {tx.title} ({tx.category})
                </div>
                <div className="text-sm text-gray-500">
                  {tx.type.toUpperCase()} - ${tx.amount} on {tx.date.split('T')[0]}
                </div>
              </div>
              <div className="space-x-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  className="border p-1 rounded text-blue-500 text-sm"
                  onClick={() => onEdit(tx)}
                >
                  Edit
                </button>
                <button
                  className="border p-1 rounded text-red-500 text-sm"
                  onClick={() => handleDelete(tx._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center mt-4">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;