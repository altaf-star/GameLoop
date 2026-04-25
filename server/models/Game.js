const mongoose = require('mongoose');

const GENRES = ['Action', 'Adventure', 'Sports', 'Racing', 'RPG', 'Shooter', 'Fighting', 'Horror', 'Strategy', 'Simulation'];

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: 'text' },
  genre: { type: String, required: true, enum: GENRES },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  imageFit: { type: String, enum: ['cover', 'contain'], default: 'cover' },
  // `available` tracks physical stock. One CD per title — simple but matches
  // a real small-scale rental operation. Could be a count for multi-copy inventory.
  available: { type: Boolean, default: true },
  rentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

gameSchema.statics.GENRES = GENRES;

module.exports = mongoose.model('Game', gameSchema);
