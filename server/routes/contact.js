const router = require('express').Router();
const { send } = require('../controllers/contactController');

router.post('/', send);

module.exports = router;
