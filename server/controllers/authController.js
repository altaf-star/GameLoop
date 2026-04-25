const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail, templates } = require('../utils/email');

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    address: user.address || {},
    isVerified: !!user.isVerified,
  };
}

// 6-digit numeric code; padded so we never surprise the frontend with 5 chars.
function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const VERIFICATION_TTL_MIN = 15;

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (!phone) return res.status(400).json({ message: 'Phone number is required for delivery' });
    if (!address?.street || !address?.city) {
      return res.status(400).json({ message: 'Street and city are required for delivery' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const code = generateCode();
    const user = await User.create({
      name, email, password, phone, address,
      verificationCode: code,
      verificationCodeExpires: new Date(Date.now() + VERIFICATION_TTL_MIN * 60 * 1000),
    });

    // Send the verification code. When SMTP isn't configured the code is
    // logged to the server console — useful for dev without a mailbox.
    const t = templates.verification(user.name, code);
    sendEmail({ to: user.email, ...t });
    if (!process.env.EMAIL_USER) {
      console.log(`[DEV] Verification code for ${user.email}: ${code}`);
    }

    res.status(201).json({
      token: signToken(user),
      user: sanitize(user),
      message: 'Account created. Check your email for a 6-digit verification code.',
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ token: signToken(user), user: sanitize(user) });
  } catch (err) { next(err); }
};

exports.me = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};

// Checks the 6-digit code. On success, flips isVerified and clears the code
// so it can't be replayed. Sends a welcome email at this point (rather than
// at signup) since it's the real "account is usable" moment.
exports.verifyEmail = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });

    const user = await User.findById(req.user._id).select('+verificationCode +verificationCodeExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.json({ user: sanitize(user), message: 'Already verified' });

    if (!user.verificationCode || String(user.verificationCode) !== String(code)) {
      return res.status(400).json({ message: 'Invalid code' });
    }
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: 'Code expired. Request a new one.' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    sendEmail({ to: user.email, ...templates.welcome(user.name) });

    res.json({ user: sanitize(user), message: 'Email verified' });
  } catch (err) { next(err); }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(409).json({ message: 'Already verified' });

    const code = generateCode();
    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + VERIFICATION_TTL_MIN * 60 * 1000);
    await user.save();

    sendEmail({ to: user.email, ...templates.verification(user.name, code) });
    if (!process.env.EMAIL_USER) {
      console.log(`[DEV] New verification code for ${user.email}: ${code}`);
    }
    res.json({ message: 'New verification code sent' });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { phone, address } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (phone !== undefined) user.phone = phone;
    if (address) user.address = { ...user.address?.toObject?.() || {}, ...address };
    await user.save();
    res.json({ user: sanitize(user) });
  } catch (err) { next(err); }
};
