const Rental = require('../models/Rental');
const Game = require('../models/Game');
const Subscription = require('../models/Subscription');
const { sendEmail, templates } = require('../utils/email');

const RENTAL_WINDOW_DAYS = 14;

exports.rent = async (req, res, next) => {
  try {
    const { gameId } = req.body;

    // Belt-and-braces: shouldn't happen via normal flow (an unverified user
    // can't subscribe in the first place) but defends against older accounts
    // created before the verification gate existed.
    if (!req.user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before renting.' });
    }

    // 1. Must have an active subscription.
    const sub = await Subscription.findOne({ user: req.user._id, status: 'active' });
    if (!sub) return res.status(403).json({ message: 'No active subscription' });

    // 2. Subscription end date check.
    if (sub.endDate < new Date()) {
      sub.status = 'expired'; await sub.save();
      return res.status(403).json({ message: 'Subscription expired' });
    }

    // 3. Slot check.
    const activeCount = await Rental.countDocuments({ subscription: sub._id, status: 'active' });
    if (activeCount >= sub.gameLimit) {
      return res.status(403).json({ message: 'Rental limit reached for this plan' });
    }

    // 4. Game must exist and be available.
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (!game.available) return res.status(409).json({ message: 'Game is currently rented' });

    // 5. Mark unavailable + create rental. Not a true transaction (Atlas free
    //    tier is a replica set so it would support one, but keeping the code
    //    straightforward for an FYP).
    game.available = false;
    game.rentedBy = req.user._id;
    await game.save();

    const deadline = new Date(Date.now() + RENTAL_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const rental = await Rental.create({
      user: req.user._id,
      game: game._id,
      subscription: sub._id,
      returnDeadline: deadline,
    });

    const t = templates.rentalConfirmed(req.user.name, game.title, deadline);
    sendEmail({ to: req.user.email, ...t });

    res.status(201).json(await rental.populate('game'));
  } catch (err) { next(err); }
};

exports.returnGame = async (req, res, next) => {
  try {
    const { rentalId } = req.body;
    const rental = await Rental.findById(rentalId);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (String(rental.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (rental.status === 'returned') {
      return res.status(409).json({ message: 'Already returned' });
    }

    rental.returnedAt = new Date();
    rental.status = 'returned';
    await rental.save();

    // Free the physical copy.
    const game = await Game.findById(rental.game);
    if (game) {
      game.available = true;
      game.rentedBy = null;
      await game.save();
    }
    res.json(rental);
  } catch (err) { next(err); }
};

// Admin moves the physical delivery forward: processing -> dispatched -> delivered.
// Independent of the rental status field (which only flips to `returned` when
// the CD comes back). Notifies the user by email at each step.
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { deliveryStatus, deliveryNote } = req.body;
    if (!['processing', 'dispatched', 'delivered'].includes(deliveryStatus)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }
    const rental = await Rental.findById(req.params.id).populate('game').populate('user', 'name email');
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    rental.deliveryStatus = deliveryStatus;
    if (deliveryNote !== undefined) rental.deliveryNote = deliveryNote;
    await rental.save();

    if (rental.user?.email) {
      const t = templates.deliveryUpdate(rental.user.name, rental.game?.title || 'your game', deliveryStatus);
      sendEmail({ to: rental.user.email, ...t });
    }
    res.json(rental);
  } catch (err) { next(err); }
};

// Current user's active rentals, with late flag for the dashboard warning UI.
exports.mine = async (req, res, next) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('game')
      .sort({ createdAt: -1 });
    const now = Date.now();
    const withLate = rentals.map(r => {
      const isLate = r.status === 'active' && r.returnDeadline < now;
      return { ...r.toObject(), isLate };
    });
    res.json(withLate);
  } catch (err) { next(err); }
};
