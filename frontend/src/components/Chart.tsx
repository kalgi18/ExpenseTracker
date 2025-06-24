import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Props {
  selectedMonth: number;
  selectedYear: number;
  transactions: any[];
  onMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// 🎨 Generate distinct HSL colors
const generateColors = (count: number): string[] => {
  const colors: string[] = [];
  const saturation = 65;
  const lightness = 55;

  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 / count) * i);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};

const Chart: React.FC<Props> = ({
  selectedMonth,
  selectedYear,
  transactions,
  onMonthChange,
  onYearChange
}) => {
  const filtered = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
  });

  const categoryMap: Record<string, number> = {};
  let totalIncome = 0;
  let totalExpense = 0;

  filtered.forEach(tx => {
    if (tx.type === 'expense') {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
      totalExpense += tx.amount;
    } else if (tx.type === 'income') {
      totalIncome += tx.amount;
    }
  });

  const categoryNames = Object.keys(categoryMap);
  const colors = generateColors(categoryNames.length);

  const data = categoryNames.map((category, index) => ({
    category,
    amount: categoryMap[category],
    color: colors[index]
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div>
      {/* Month & Year Select */}
      <div className="flex justify-between items-center mb-4">
        <select onChange={onMonthChange} value={selectedMonth} className="border p-2 rounded">
          {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select onChange={onYearChange} value={selectedYear} className="border p-2 rounded">
          {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* Chart + Legend in a row */}
        <div className="flex flex-col md:flex-row justify-center items-start gap-8">
          
          {/* Pie Chart */}
          <div className="w-full md:w-3/4 flex justify-center">
            <PieChart width={300} height={300}>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Legend List */}
          <div className="w-full md:w-1/4 space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-800 text-sm font-medium">
                  {item.category} - ${item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Income/Expense Totals */}
        <div className="text-center text-sm text-gray-900 font-medium space-y-1">
          <p>Total Income: ${totalIncome}</p>
          <p>Total Expenses: ${totalExpense}</p>
        </div>
      </div>
    </div>
  );
};

export default Chart;