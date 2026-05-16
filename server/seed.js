require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Game = require('./models/Game');

// Using public cover art URLs so the app is demo-ready without requiring
// admin to upload 5 images first. Replace via the admin panel if needed.
const GAMES = [
  {
    title: 'FC26',
    genre: 'Sports',
    description: 'EA Sports FC 26 brings football fans closer to the beautiful game with HyperMotion V, PlayStyles powered by Opta, and an enhanced Frostbite engine.',
    image: '/covers/fc26.png',
  },
  {
    title: 'Call of Duty Modern Warfare',
    genre: 'Shooter',
    description: 'The remastered classic. Captain Price and the original SAS task force across iconic missions, rebuilt with modern visuals and audio.',
    image: '/covers/cod.jpg',
  },
  {
    title: 'Marvel Spiderman',
    genre: 'Action',
    description: 'Swing through New York as Miles Morales in an electrifying standalone adventure packed with venom-powered combat and heartfelt story beats.',
    image: '/covers/spiderman.webp',
  },
  {
    title: 'God of War Ragnarok',
    genre: 'Adventure',
    description: 'Kratos and Atreus journey through the Nine Realms in search of answers as Asgardian forces prepare for Ragnarok.',
    image: '/covers/godofwar.jpg',
  },
  {
    title: 'Grand Theft Auto V',
    genre: 'Action',
    description: 'Explore the sprawling world of Los Santos and Blaine County, enhanced for PS5 with improved visuals and faster loading.',
    image: '/covers/gta.png',
  },
];

// Idempotent: only inserts what's missing. Safe to call on every boot.
// Exported so the server can auto-seed when running with the in-memory DB,
// and usable standalone via `npm run seed` against a real DB.
async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || 'gameloop35gl@gmail.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'abdullaH1150';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPass,
      role: 'admin',
      phone: '03001234567',
      address: { street: 'GameLoop HQ', city: 'Lahore', postalCode: '54000' },
      isVerified: true,
    });
    console.log(`Seed: admin created ${adminEmail} / ${adminPass}`);
  }

  const testEmail = 'user@gameloop.com';
  const existingUser = await User.findOne({ email: testEmail });
  if (!existingUser) {
    // Test user is pre-verified so demos flow without checking an inbox.
    await User.create({
      name: 'Test User',
      email: testEmail,
      password: 'user123',
      phone: '03007654321',
      address: { street: '123 Main Street, Gulberg III', city: 'Lahore', postalCode: '54660' },
      isVerified: true,
    });
    console.log(`Seed: test user created ${testEmail} / user123`);
  }

  const count = await Game.countDocuments();
  if (count === 0) {
    await Game.insertMany(GAMES);
    console.log(`Seed: ${GAMES.length} games inserted`);
  }
}

// When executed directly (`node seed.js`), connect + seed + disconnect.
if (require.main === module) {
  (async () => {
    await connectDB();
    await seed();
    await mongoose.disconnect();
    console.log('Done.');
  })().catch(err => { console.error(err); process.exit(1); });
}

module.exports = seed;
