const multer = require('multer');
const { gameStorage, paymentStorage } = require('../config/cloudinary');

// 5MB ceiling keeps uploads sane — payment screenshots and cover art
// never legitimately need more than that.
const limits = { fileSize: 5 * 1024 * 1024 };

const uploadGame = multer({ storage: gameStorage, limits });
const uploadPayment = multer({ storage: paymentStorage, limits });

module.exports = { uploadGame, uploadPayment };
