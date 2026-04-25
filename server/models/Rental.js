const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
  rentedAt: { type: Date, default: Date.now },
  // Default 14-day rental window; set at creation time so it survives plan changes.
  returnDeadline: { type: Date, required: true },
  returnedAt: { type: Date, default: null },
  status: { type: String, enum: ['active', 'returned', 'late'], default: 'active' },

  // Physical delivery lifecycle — orthogonal to rental status. Admin moves
  // this forward as the CD travels to the customer. Once `returned`, the
  // rental is closed regardless of this field.
  deliveryStatus: {
    type: String,
    enum: ['processing', 'dispatched', 'delivered'],
    default: 'processing',
  },
  deliveryNote: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);
