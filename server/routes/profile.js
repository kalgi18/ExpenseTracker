const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const verifyToken = require('../middleware/auth');

// GET /profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('name email');

    const transactions = await Transaction.find({ userId });

    const totalIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpenditure = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const highestExpense = Math.max(
      0,
      ...transactions.filter(tx => tx.type === 'expense').map(tx => tx.amount)
    );

    // Group expenses by month
    const monthlySums = {};
    transactions.forEach(tx => {
      const month = new Date(tx.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlySums[month]) monthlySums[month] = { income: 0, expense: 0 };
      if (tx.type === 'income') monthlySums[month].income += tx.amount;
      else monthlySums[month].expense += tx.amount;
    });

    const avgMonthlyCost = Object.values(monthlySums).reduce(
      (sum, { expense }) => sum + expense,
      0
    ) / Object.keys(monthlySums).length || 0;

    res.status(200).json({
      user,
      stats: {
        totalIncome,
        totalExpenditure,
        highestExpense,
        avgMonthlyCost: Number(avgMonthlyCost.toFixed(2)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile data' });
  }
});


// routes/profile.js
router.get('/profile/monthly-summary', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId });

    // Initialize 12 months
    const summary = {};
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    for (let i = 0; i < 12; i++) {
      summary[i] = { month: months[i], income: 0, expense: 0 };
    }

    // Fill values
    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const monthIndex = date.getMonth(); // 0 = Jan
      if (tx.type === 'income') {
        summary[monthIndex].income += tx.amount;
      } else {
        summary[monthIndex].expense += tx.amount;
      }
    });

    const result = Object.values(summary); // [{ month: 'Jan', income: 100, expense: 50 }, ...]

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch monthly data' });
  }
});

module.exports = router;