const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Separate folders keep the Cloudinary dashboard tidy and let the admin
// browse game art vs payment proofs independently.
const gameStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gameloop/games',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 1000, crop: 'limit' }],
  },
});

const paymentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'gameloop/payments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

module.exports = { cloudinary, gameStorage, paymentStorage };
