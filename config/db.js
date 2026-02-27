const mongoose = require('mongoose');
let mem;

async function connectDB() {
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clms';
  const useMem = process.env.MONGODB_USE_MEMORY === 'true';
  if (useMem) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mem = await MongoMemoryServer.create();
    uri = mem.getUri('clms');
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (e) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mem = await MongoMemoryServer.create();
    uri = mem.getUri('clms');
    await mongoose.connect(uri);
    console.log('MongoDB connected (memory)');
  }
}

module.exports = connectDB;
