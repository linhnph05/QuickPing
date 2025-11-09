import express from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Socket.io instance will be set by server.js
let io;

// Get messages for conversation
router.get('/conversation/:conversationId', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, before } = req.query;

    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      p => p.user_id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let query = { conversation_id: conversationId };
    if (before) {
      query.created_at = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('sender_id', 'username avatar_url')
      .populate('reply_to')
      .populate('file_info.file_id')
      .sort({ created_at: -1 })
      .limit(parseInt(limit));

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create message
router.post('/', authenticate, [
  body('conversation_id').isMongoId(),
  body('content').optional().trim(),
  body('type').optional().isIn(['text', 'file', 'image', 'video'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { conversation_id, content, type = 'text', file_info, reply_to, thread_id } = req.body;

    // Verify conversation and participation
    const conversation = await Conversation.findById(conversation_id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      p => p.user_id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ error: 'Not a participant' });
    }

    const message = new Message({
      conversation_id,
      sender_id: req.user._id,
      content,
      type,
      file_info,
      reply_to,
      thread_id
    });

    await message.save();

    // Update conversation last message
    conversation.last_message = message._id;
    conversation.updated_at = new Date();
    await conversation.save();

    // Populate before sending
    await message.populate('sender_id', 'username avatar_url');
    if (reply_to) {
      await message.populate('reply_to');
    }

    // Emit socket event for realtime update
    if (io) {
      const messageObject = message.toObject();
      const conversationIdStr = conversation_id.toString();
      const room = `conversation_${conversationIdStr}`;
      
      console.log(`📤 Emitting message to room: ${room}`, {
        messageId: messageObject._id,
        conversationId: conversationIdStr,
        senderId: req.user._id.toString()
      });
      
      // Get room size for debugging
      const roomSockets = await io.in(room).fetchSockets();
      console.log(`👥 Room ${room} has ${roomSockets.length} socket(s)`);
      
      // Emit to all users in the conversation room
      io.to(room).emit('message_received', {
        message: messageObject,
        conversation_id: conversationIdStr
      });
      
      console.log(`✅ Message emitted to room: ${room}`);
    } else {
      console.warn('⚠️ Socket.io not available, message saved but not broadcasted');
    }

    res.status(201).json({ message });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Edit message
router.put('/:messageId', authenticate, [
  body('content').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Can only edit your own messages' });
    }

    message.content = req.body.content;
    message.is_edited = true;
    await message.save();

    await message.populate('sender_id', 'username avatar_url');

    res.json({ message });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add reaction
router.post('/:messageId/reaction', authenticate, [
  body('emoji').trim().notEmpty()
], async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      r => r.user_id.toString() !== req.user._id.toString()
    );

    // Add new reaction
    message.reactions.push({
      emoji,
      user_id: req.user._id
    });

    await message.save();
    await message.populate('sender_id', 'username avatar_url');

    res.json({ message });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove reaction
router.delete('/:messageId/reaction/:emoji', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.reactions = message.reactions.filter(
      r => !(r.user_id.toString() === req.user._id.toString() && r.emoji === req.params.emoji)
    );

    await message.save();

    res.json({ message });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark as read
router.post('/:messageId/read', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Remove existing read_by entry
    message.read_by = message.read_by.filter(
      r => r.user_id.toString() !== req.user._id.toString()
    );

    // Add new read_by entry
    message.read_by.push({
      user_id: req.user._id,
      read_at: new Date()
    });

    await message.save();

    res.json({ message });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Function to set socket.io instance
export const setSocketIO = (socketIO) => {
  io = socketIO;
};

export default router;

