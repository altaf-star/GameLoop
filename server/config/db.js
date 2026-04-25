const mongoose = require('mongoose');

// Connects to MongoDB. Supports three modes:
//  1. MONGO_URI set to a real URI (Atlas / localhost) -> connect normally.
//  2. USE_MEMORY_DB=true -> spin up an in-memory MongoDB inside the process.
//     Lets you run the app with zero external database install. Data is lost
//     when the server stops — fine for local dev, not for production.
async function connectDB() {
  let uri = process.env.MONGO_URI;

  if (process.env.USE_MEMORY_DB === 'true') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    // Startup timeout default is 10s, which is sometimes too tight on Windows
    // after the binary has been cold for a while. 30s is a safer headroom.
    const mem = await MongoMemoryServer.create({
      instance: { launchTimeout: 30000 },
    });
    uri = mem.getUri();
    console.log('Using in-memory MongoDB');
  }

  if (!uri) {
    console.error('MONGO_URI is not set. Copy .env.example to .env and fill it in, or set USE_MEMORY_DB=true.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
