import mongoose from 'mongoose';
import { createClient } from 'redis';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/startupforge';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas successfully.');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export const redisClient = createClient({
  url: REDIS_URL
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Connected to Redis cache successfully.'));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Could not connect to Redis:', error);
  }
};
