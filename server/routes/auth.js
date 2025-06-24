const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const { register, login } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// Email config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.RESET_PASSWORD_BASE_URL}/${token}`;

    const mailOptions = {
      from: `"Expense Tracker" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. It expires in 15 mins.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset link sent to your email' });

  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});


// Reset password
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });

    res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /auth/google-login
router.post('/auth/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); // contains name, email, sub
    const { email, name, sub: googleId } = payload;

    // 2. Check if user exists
    let user = await User.findOne({ email });

    // 3. If not, auto-create user
    if (!user) {
      user = new User({
        name,
        email,
        password: googleId,   // optional fallback password, not used
        isGoogle: true,
      });
      await user.save();
    }

    // 4. Sign JWT token
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token: appToken });
  } catch (err) {
    console.error('Google login failed:', err.message);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

module.exports = router;