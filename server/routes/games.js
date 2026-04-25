const router = require('express').Router();
const { list, get, create, update, remove } = require('../controllers/gameController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { uploadGame } = require('../middleware/upload');

router.get('/', list);
router.get('/:id', get);

router.post('/', protect, adminOnly, uploadGame.single('image'), create);
router.put('/:id', protect, adminOnly, uploadGame.single('image'), update);
router.delete('/:id', protect, adminOnly, remove);

module.exports = router;
