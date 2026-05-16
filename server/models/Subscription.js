const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  plan: { type: String, enum: ['starter', 'duo', 'trio', 'vault_master'], required: true },
  gameLimit: { type: Number, required: true },
  price: { type: Number, required: true },
  // One-time refundable security deposit. Held until the subscription is
  // cancelled and returned (minus any damage charges) after games are returned.
  deposit: { type: Number, required: true, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  // `pending` until admin approves the manual payment; `active` once approved.
  // `expired` is computed/set when endDate passes.
  status: { type: String, enum: ['pending', 'active', 'expired', 'cancelled'], default: 'pending' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
}, { timestamps: true });

// Virtual: how many active rentals count against this subscription's limit.
// Computed on demand via Rental query rather than a denormalized counter —
// avoids the "counter drift" bug where the number desyncs from reality.
module.exports = mongoose.model('Subscription', subscriptionSchema);
