const router = require('express').Router();
const { rent, returnGame, mine, updateDeliveryStatus } = require('../controllers/rentalController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.post('/rent', protect, rent);
router.post('/return', protect, returnGame);
router.get('/mine', protect, mine);

// Admin-only: update the delivery stage of a rental.
router.put('/:id/delivery', protect, adminOnly, updateDeliveryStatus);

module.exports = router;
