"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const db_1 = require("../config/db");
const schemas_1 = require("../models/schemas");
class SocketManager {
    io;
    constructor(io) {
        this.io = io;
        this.init();
    }
    init() {
        this.io.on('connection', (socket) => {
            console.log(`🔌 Client connected: ${socket.id}`);
            // Handle user online presence
            socket.on('register_user', async (userId) => {
                socket.data.userId = userId;
                console.log(`👤 User registered presence: ${userId}`);
                // Save connection mapping in Redis
                try {
                    if (db_1.redisClient.isReady) {
                        await db_1.redisClient.hSet('presence_users', userId, 'online');
                        this.io.emit('presence_update', { userId, status: 'online' });
                    }
                }
                catch (error) {
                    console.error('Redis presence registration error:', error);
                }
            });
            // Join chat channels / startups workspace
            socket.on('join_channel', (channelId) => {
                socket.join(channelId);
                console.log(`📣 Socket ${socket.id} joined channel: ${channelId}`);
            });
            // Handle message sending
            socket.on('send_message', async (data) => {
                try {
                    // Store in MongoDB
                    const message = await schemas_1.ChatMessage.create(data);
                    if (data.type === 'channel' && data.channelId) {
                        // Send to channel room
                        this.io.to(data.channelId).emit('new_message', message);
                    }
                    else if (data.type === 'direct' && data.receiverId) {
                        // Send to sender and receiver
                        this.io.emit(`new_message_direct_${data.receiverId}`, message);
                        this.io.emit(`new_message_direct_${data.senderId}`, message);
                    }
                }
                catch (error) {
                    console.error('Socket message handler error:', error);
                    socket.emit('message_error', { error: 'Failed to deliver message' });
                }
            });
            // Handle typing status indicators
            socket.on('typing', (data) => {
                if (data.channelId) {
                    socket.to(data.channelId).emit('typing', data);
                }
                else if (data.receiverId) {
                    this.io.emit(`typing_direct_${data.receiverId}`, data);
                }
            });
            socket.on('disconnect', async () => {
                console.log(`🔌 Client disconnected: ${socket.id}`);
                const userId = socket.data.userId;
                if (userId) {
                    try {
                        if (db_1.redisClient.isReady) {
                            await db_1.redisClient.hDel('presence_users', userId);
                            this.io.emit('presence_update', { userId, status: 'offline' });
                        }
                    }
                    catch (error) {
                        console.error('Redis presence deletion error:', error);
                    }
                }
            });
        });
    }
}
exports.SocketManager = SocketManager;
