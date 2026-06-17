import { Server as SocketIOServer, Socket } from 'socket.io';
import { redisClient } from '../config/db';
import { ChatMessage } from '../models/schemas';

export class SocketManager {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.init();
  }

  private init() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle user online presence
      socket.on('register_user', async (userId: string) => {
        socket.data.userId = userId;
        console.log(`👤 User registered presence: ${userId}`);
        
        // Save connection mapping in Redis
        try {
          if (redisClient.isReady) {
            await redisClient.hSet('presence_users', userId, 'online');
            this.io.emit('presence_update', { userId, status: 'online' });
          }
        } catch (error) {
          console.error('Redis presence registration error:', error);
        }
      });

      // Join chat channels / startups workspace
      socket.on('join_channel', (channelId: string) => {
        socket.join(channelId);
        console.log(`📣 Socket ${socket.id} joined channel: ${channelId}`);
      });

      // Handle message sending
      socket.on('send_message', async (data: {
        senderId: string;
        receiverId?: string;
        channelId?: string;
        content: string;
        type: 'direct' | 'channel';
      }) => {
        try {
          // Store in MongoDB
          const message = await ChatMessage.create(data);

          if (data.type === 'channel' && data.channelId) {
            // Send to channel room
            this.io.to(data.channelId).emit('new_message', message);
          } else if (data.type === 'direct' && data.receiverId) {
            // Send to sender and receiver
            this.io.emit(`new_message_direct_${data.receiverId}`, message);
            this.io.emit(`new_message_direct_${data.senderId}`, message);
          }
        } catch (error) {
          console.error('Socket message handler error:', error);
          socket.emit('message_error', { error: 'Failed to deliver message' });
        }
      });

      // Handle typing status indicators
      socket.on('typing', (data: { channelId?: string; receiverId?: string; userId: string; isTyping: boolean }) => {
        if (data.channelId) {
          socket.to(data.channelId).emit('typing', data);
        } else if (data.receiverId) {
          this.io.emit(`typing_direct_${data.receiverId}`, data);
        }
      });

      socket.on('disconnect', async () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
        const userId = socket.data.userId;
        if (userId) {
          try {
            if (redisClient.isReady) {
              await redisClient.hDel('presence_users', userId);
              this.io.emit('presence_update', { userId, status: 'offline' });
            }
          } catch (error) {
            console.error('Redis presence deletion error:', error);
          }
        }
      });
    });
  }
}
