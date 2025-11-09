import User from '../models/User.js';
import Conversation from '../models/Conversation.js';

export const setupSocketIO = (io) => {
  const userSockets = new Map(); // userId -> socketId

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    userSockets.set(userId, socket.id);

    // Update user online status
    try {
      await User.findByIdAndUpdate(userId, { 
        is_online: true,
        last_seen: new Date()
      });
      console.log(`✅ User ${userId} marked as online`);
      
      // Notify all users about online status
      io.emit('user_status_changed', {
        user_id: userId,
        is_online: true,
        last_seen: new Date()
      });
    } catch (err) {
      console.error('Update online status error:', err);
    }

    // Join user's room
    socket.join(`user_${userId}`);

    // Join conversation rooms user is part of
    try {
      const conversations = await Conversation.find({ 'participants.user_id': userId });
      conversations.forEach(conv => {
        socket.join(`conversation_${conv._id}`);
      });
    } catch (err) {
      console.error('Join conversations error:', err);
    }

    // Handle join conversation
    socket.on('join_conversation', async (conversationId) => {
      const room = `conversation_${conversationId}`;
      socket.join(room);
      console.log(`✅ User ${userId} joined conversation room: ${room}`);
      
      // Confirm join to client
      socket.emit('joined_conversation', { conversation_id: conversationId });
    });

    // Handle leave conversation
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
    });

    // Handle new message
    socket.on('new_message', async (data) => {
      // Broadcast to conversation room
      io.to(`conversation_${data.conversation_id}`).emit('message_received', data);
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(`conversation_${data.conversation_id}`).emit('user_typing', {
        user_id: userId,
        username: socket.user?.username || 'User',
        conversation_id: data.conversation_id
      });
    });

    // Handle stop typing
    socket.on('stop_typing', (data) => {
      socket.to(`conversation_${data.conversation_id}`).emit('user_stopped_typing', {
        user_id: userId,
        conversation_id: data.conversation_id
      });
    });

    // Handle read receipt
    socket.on('message_read', (data) => {
      socket.to(`conversation_${data.conversation_id}`).emit('read_receipt', {
        user_id: userId,
        message_id: data.message_id
      });
    });

    // Handle online status change
    socket.on('update_status', (status) => {
      io.emit('user_status_changed', {
        user_id: userId,
        is_online: status.is_online,
        last_seen: status.last_seen
      });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      userSockets.delete(userId);
      
      console.log(`🔌 User ${userId} disconnected`);
      
      // Update user offline status
      try {
        await User.findByIdAndUpdate(userId, {
          is_online: false,
          last_seen: new Date()
        });
        console.log(`✅ User ${userId} marked as offline`);
      } catch (err) {
        console.error('Update offline status error:', err);
      }

      // Notify all connected users
      io.emit('user_status_changed', {
        user_id: userId,
        is_online: false,
        last_seen: new Date()
      });
      console.log(`📤 Broadcasted offline status for user ${userId}`);
    });
  });

  return io;
};

