const Subscription = require('../models/Subscription');
const Rental = require('../models/Rental');
const { PLANS } = require('../utils/plans');

exports.listPlans = (req, res) => {
  res.json(PLANS);
};

// User subscribes -> creates a `pending` subscription that becomes `active`
// only after admin approves the payment screenshot.
exports.subscribe = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const def = PLANS[plan];
    if (!def) return res.status(400).json({ message: 'Invalid plan' });

    // Gate on email verification — ensures we can actually reach the user
    // about their order before they pay.
    if (!req.user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before subscribing.' });
    }

    const existing = await Subscription.findOne({ user: req.user._id, status: { $in: ['pending', 'active'] } });
    if (existing) {
      return res.status(409).json({ message: 'You already have an active or pending subscription' });
    }

    const start = new Date();
    const end = new Date(start.getTime() + def.durationDays * 24 * 60 * 60 * 1000);
    const sub = await Subscription.create({
      user: req.user._id,
      plan,
      gameLimit: def.gameLimit,
      price: def.price,
      startDate: start,
      endDate: end,
      status: 'pending',
    });
    res.status(201).json(sub);
  } catch (err) { next(err); }
};

// Current user's active/pending subscription plus live rental slot count.
exports.current = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['pending', 'active'] },
    }).populate('payment');

    if (!sub) return res.json({ subscription: null, activeRentals: 0, slotsLeft: 0 });

    const activeRentals = await Rental.countDocuments({
      subscription: sub._id, status: 'active',
    });
    res.json({
      subscription: sub,
      activeRentals,
      slotsLeft: Math.max(0, sub.gameLimit - activeRentals),
    });
  } catch (err) { next(err); }
};

exports.mine = async (req, res, next) => {
  try {
    const subs = await Subscription.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) { next(err); }
};
