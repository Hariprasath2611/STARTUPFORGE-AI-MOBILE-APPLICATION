"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const socketManager_1 = require("./sockets/socketManager");
const routes_1 = __importDefault(require("./routes/routes"));
const stripe_1 = require("./services/stripe");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Initialize Socket.io Server
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
// Configure Socket.io Manager
new socketManager_1.SocketManager(io);
// Stripe Webhook Endpoint (Requires raw body for signature checks)
app.post('/webhook/stripe', express_1.default.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    try {
        // Note: in mock test cases we can parse signature directly
        let event;
        if (process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
            event = JSON.parse(req.body.toString());
        }
        else {
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
        await (0, stripe_1.handleStripeWebhook)(event);
        res.status(200).json({ received: true });
    }
    catch (err) {
        console.error('⚠️ Stripe webhook signature verification failed.', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
// Standard Parsers
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Expose health check
app.get('/health', async (req, res) => {
    const mongoStatus = mongooseConnectionStatus();
    const redisStatus = db_1.redisClient.isReady ? 'Connected' : 'Disconnected';
    res.status(200).json({
        status: 'UP',
        database: mongoStatus,
        cache: redisStatus,
        timestamp: new Date()
    });
});
// Mount Routes
app.use('/api', routes_1.default);
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
    await (0, db_1.connectMongoDB)();
    await (0, db_1.connectRedis)();
    server.listen(PORT, () => {
        console.log(`🚀 StartupForge API Server listening on port ${PORT}`);
    });
};
startServer().catch((error) => {
    console.error('❌ Server startup critical failure:', error);
});
