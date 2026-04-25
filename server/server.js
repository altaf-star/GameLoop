require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seed = require('./seed');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Render sits behind a proxy — trust the first hop so req.ip reflects the
// real client (needed for the contact form's per-IP rate limit).
app.set('trust proxy', 1);

// CORS: when CLIENT_URL is set, lock down to that origin. During local dev
// without CLIENT_URL, allow all — prevents a dev-time "why doesn't login work" headache.
const clientUrl = process.env.CLIENT_URL;
app.use(cors({
  origin: clientUrl || true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lightweight health endpoint — used by the frontend cold-start splash to
// detect when the Render Web Service has woken up.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  // In memory-DB mode the database is always empty on boot, so seed
  // transparently. AUTO_SEED=true forces this on a persistent DB too.
  if (process.env.USE_MEMORY_DB === 'true' || process.env.AUTO_SEED === 'true') {
    await seed();
  }
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
})();
