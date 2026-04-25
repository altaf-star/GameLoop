const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { sendEmail, templates } = require('../utils/email');

exports.create = async (req, res, next) => {
  try {
    const { subscriptionId, amount, method, transactionId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Screenshot is required' });

    const sub = await Subscription.findById(subscriptionId);
    if (!sub || String(sub.user) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const payment = await Payment.create({
      user: req.user._id,
      subscription: sub._id,
      amount: Number(amount) || sub.price,
      method,
      transactionId: transactionId || '',
      screenshot: req.file.path,
      screenshotPublicId: req.file.filename,
    });
    sub.payment = payment._id;
    await sub.save();
    res.status(201).json(payment);
  } catch (err) { next(err); }
};

exports.mine = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('subscription')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) { next(err); }
};

// Admin approves or rejects. Approval flips the linked subscription to `active`.
exports.review = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'pending') {
      return res.status(409).json({ message: 'Payment already reviewed' });
    }

    payment.status = status;
    payment.reviewedBy = req.user._id;
    payment.reviewedAt = new Date();
    if (status === 'rejected') payment.rejectionReason = rejectionReason || 'Not verified';
    await payment.save();

    const user = await User.findById(payment.user);

    if (status === 'approved') {
      const sub = await Subscription.findById(payment.subscription);
      if (sub && sub.status === 'pending') {
        sub.status = 'active';
        // Restart the clock from approval date — feels fair since the user
        // couldn't rent while awaiting review.
        sub.startDate = new Date();
        sub.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await sub.save();
      }
      if (user) sendEmail({ to: user.email, ...templates.paymentApproved(user.name, payment.amount) });
    } else if (user) {
      sendEmail({ to: user.email, ...templates.paymentRejected(user.name) });
    }
    res.json(payment);
  } catch (err) { next(err); }
};
