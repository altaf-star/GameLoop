const router = require('express').Router();
const { listPlans, subscribe, current, mine } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.get('/plans', listPlans);
router.post('/', protect, subscribe);
router.get('/current', protect, current);
router.get('/mine', protect, mine);

module.exports = router;
