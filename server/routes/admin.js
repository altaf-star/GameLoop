const router = require('express').Router();
const { listUsers, listSubscriptions, listRentals, listPayments, stats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect, adminOnly);

router.get('/stats', stats);
router.get('/users', listUsers);
router.get('/subscriptions', listSubscriptions);
router.get('/rentals', listRentals);
router.get('/payments', listPayments);

module.exports = router;
