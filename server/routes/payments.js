const router = require('express').Router();
const { create, mine, review } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { uploadPayment } = require('../middleware/upload');

router.post('/', protect, uploadPayment.single('screenshot'), create);
router.get('/mine', protect, mine);
router.put('/:id', protect, adminOnly, review);

module.exports = router;
