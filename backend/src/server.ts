import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB, connectRedis, redisClient } from './config/db';
import { SocketManager } from './sockets/socketManager';
import apiRoutes from './routes/routes';
import { handleStripeWebhook } from './services/stripe';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io Server
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Configure Socket.io Manager
new SocketManager(io);

// Stripe Webhook Endpoint (Requires raw body for signature checks)
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  try {
    // Note: in mock test cases we can parse signature directly
    let event;
    if (process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
      event = JSON.parse(req.body.toString());
    } else {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    
    await handleStripeWebhook(event);
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('⚠️ Stripe webhook signature verification failed.', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Standard Parsers
app.use(cors());
app.use(express.json());

// Expose health check
app.get('/health', async (req: Request, res: Response) => {
  const mongoStatus = mongooseConnectionStatus();
  const redisStatus = redisClient.isReady ? 'Connected' : 'Disconnected';
  res.status(200).json({
    status: 'UP',
    database: mongoStatus,
    cache: redisStatus,
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api', apiRoutes);

// Helper for Mongo status checking
function mongooseConnectionStatus() {
  const mongoose = require('mongoose');
  switch (mongoose.connection.readyState) {
    case 0: return 'Disconnected';
    case 1: return 'Connected';
    case 2: return 'Connecting';
    case 3: return 'Disconnecting';
    default: return 'Unknown';
  }
}

// Server Startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect Databases
  await connectMongoDB();
  await connectRedis();

  server.listen(PORT, () => {
    console.log(`🚀 StartupForge API Server listening on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('❌ Server startup critical failure:', error);
});
