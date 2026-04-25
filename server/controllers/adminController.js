const User = require('../models/User');
const Game = require('../models/Game');
const Subscription = require('../models/Subscription');
const Rental = require('../models/Rental');
const Payment = require('../models/Payment');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { next(err); }
};

exports.listSubscriptions = async (req, res, next) => {
  try {
    const subs = await Subscription.find()
      .populate('user', 'name email phone address isVerified')
      .populate('payment')
      .sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) { next(err); }
};

exports.listRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'name email phone address isVerified')
      .populate('game', 'title image')
      .sort({ createdAt: -1 });
    const now = Date.now();
    res.json(rentals.map(r => ({
      ...r.toObject(),
      isLate: r.status === 'active' && r.returnDeadline < now,
    })));
  } catch (err) { next(err); }
};

exports.listPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email phone address isVerified')
      .populate('subscription', 'plan price')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) { next(err); }
};

// Dashboard summary: four headline numbers admins see on login.
exports.stats = async (req, res, next) => {
  try {
    const [totalUsers, totalGames, activeRentals, revenueAgg] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Game.countDocuments(),
      Rental.countDocuments({ status: 'active' }),
      Payment.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);
    res.json({
      totalUsers,
      totalGames,
      activeRentals,
      revenue: revenueAgg[0]?.total || 0,
    });
  } catch (err) { next(err); }
};
