const router = require('express').Router();
const {
  register, login, me,
  verifyEmail, resendVerification, updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);

router.post('/verify-email', protect, verifyEmail);
router.post('/resend-verification', protect, resendVerification);
router.put('/profile', protect, updateProfile);

module.exports = router;
