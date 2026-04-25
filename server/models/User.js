const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  street: { type: String, trim: true, default: '' },
  city: { type: String, trim: true, default: '' },
  postalCode: { type: String, trim: true, default: '' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // Delivery contact info — collected at signup because we need them before
  // the first rental can be fulfilled. Stored loosely (no hard phone regex)
  // since Pakistani users enter numbers in many formats.
  phone: { type: String, trim: true, default: '' },
  address: { type: addressSchema, default: () => ({}) },

  // Email verification gate. Users can sign up and log in when unverified,
  // but can't subscribe/rent until they confirm the code we emailed them.
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String, select: false },
  verificationCodeExpires: { type: Date, select: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
