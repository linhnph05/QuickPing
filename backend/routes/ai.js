import express from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import File from '../models/File.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Summarize conversation/thread
router.post('/summarize', authenticate, [
  body('conversation_id').optional().isMongoId(),
  body('thread_id').optional().isMongoId(),
  body('type').isIn(['conversation', 'thread'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { conversation_id, thread_id, type } = req.body;

    let messages;
    
    if (type === 'thread' && thread_id) {
      messages = await Message.find({
        $or: [
          { _id: thread_id },
          { thread_id: thread_id }
        ]
      })
      .populate('sender_id', 'username')
      .sort({ created_at: 1 });
    } else if (conversation_id) {
      messages = await Message.find({ conversation_id })
        .populate('sender_id', 'username')
        .sort({ created_at: 1 })
        .limit(100);
    } else {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    // Check access
    if (conversation_id) {
      const conversation = await Conversation.findById(conversation_id);
      const isParticipant = conversation?.participants.some(
        p => p.user_id.toString() === req.user._id.toString()
      );
      if (!isParticipant) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Format messages for AI
    const conversationText = messages
      .map(m => `${m.sender_id.username}: ${m.content || '[File attachment]'}`)
      .join('\n');

    // In production, use OpenAI API
    // For prototype, return a simple summary
    const summary = `This is a conversation summary with ${messages.length} messages. ` +
      `The discussion covered various topics. ` +
      `Key participants: ${[...new Set(messages.map(m => m.sender_id.username))].join(', ')}.`;

    // Save summary to first message if thread, or create a system message
    if (type === 'thread' && messages.length > 0) {
      messages[0].ai_summary = summary;
      await messages[0].save();
    }

    res.json({ summary, message_count: messages.length });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Summarize file (document)
router.post('/summarize-file', authenticate, [
  body('file_id').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const file = await File.findById(req.params.file_id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // In production, extract text from file and use AI to summarize
    // For prototype, return placeholder
    const summary = `Summary of file: ${file.original_name} (${file.size} bytes). ` +
      `This is a placeholder summary. In production, the actual content would be analyzed.`;

    res.json({ summary, file: file.original_name });
  } catch (error) {
    console.error('Summarize file error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

