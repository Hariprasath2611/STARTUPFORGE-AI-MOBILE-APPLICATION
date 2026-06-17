"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = exports.connectMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/startupforge';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const connectMongoDB = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas successfully.');
    }
    catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};
exports.connectMongoDB = connectMongoDB;
exports.redisClient = (0, redis_1.createClient)({
    url: REDIS_URL
});
exports.redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));
exports.redisClient.on('connect', () => console.log('✅ Connected to Redis cache successfully.'));
const connectRedis = async () => {
    try {
        await exports.redisClient.connect();
    }
    catch (error) {
        console.error('❌ Could not connect to Redis:', error);
    }
};
exports.connectRedis = connectRedis;
