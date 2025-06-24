const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const verifyToken = require('../middleware/auth');

// POST /transaction - Add new transaction
router.post('/transaction', verifyToken, async (req, res) => {
  try {
    const newTx = new Transaction({ ...req.body, userId: req.user.id });
    const saved = await newTx.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add transaction' });
  }
});

// GET /transactions - Get user's transactions
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get transactions' });
  }
});

// DELETE /transaction/:id - Delete a transaction
router.delete('/transaction/:id', verifyToken, async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

// PUT /transaction/:id - Update a transaction
router.put('/transaction/:id', verifyToken, async (req, res) => {
  try {
    const updatedTx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedTx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(updatedTx);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update transaction' });
  }
});

module.exports = router;