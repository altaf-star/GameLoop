const Game = require('../models/Game');
const { cloudinary } = require('../config/cloudinary');

// Public list — supports search, genre filter, pagination.
exports.list = async (req, res, next) => {
  try {
    const { search = '', genre = '', page = 1, limit = 12 } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (genre) filter.genre = genre;

    const pageNum = Math.max(1, parseInt(page, 10));
    const perPage = Math.min(50, parseInt(limit, 10));

    const [items, total] = await Promise.all([
      Game.find(filter).sort({ createdAt: -1 })
        .skip((pageNum - 1) * perPage).limit(perPage),
      Game.countDocuments(filter),
    ]);

    res.json({
      items, total, page: pageNum, pages: Math.ceil(total / perPage),
      genres: Game.GENRES,
    });
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, genre, description } = req.body;
    const payload = { title, genre, description };
    if (req.file) {
      payload.image = req.file.path;
      payload.imagePublicId = req.file.filename;
    }
    const game = await Game.create(payload);
    res.status(201).json(game);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    const { title, genre, description } = req.body;
    if (title) game.title = title;
    if (genre) game.genre = genre;
    if (description) game.description = description;

    if (req.file) {
      // Best-effort delete of the old image to avoid orphaning Cloudinary storage.
      if (game.imagePublicId) {
        try { await cloudinary.uploader.destroy(game.imagePublicId); } catch (_) {}
      }
      game.image = req.file.path;
      game.imagePublicId = req.file.filename;
    }
    await game.save();
    res.json(game);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.imagePublicId) {
      try { await cloudinary.uploader.destroy(game.imagePublicId); } catch (_) {}
    }
    await game.deleteOne();
    res.json({ message: 'Game deleted' });
  } catch (err) { next(err); }
};
