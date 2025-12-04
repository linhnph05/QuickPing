import express from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Simple in-memory cache for summaries
const summaryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limiting - simple in-memory implementation
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per user

function checkRateLimit(userId) {
  const now = Date.now();
  const userLimits = rateLimits.get(userId) || { count: 0, windowStart: now };
  
  // Reset window if expired
  if (now - userLimits.windowStart > RATE_LIMIT_WINDOW) {
    userLimits.count = 0;
    userLimits.windowStart = now;
  }
  
  if (userLimits.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  userLimits.count++;
  rateLimits.set(userId, userLimits);
  return true;
}

// Get cached summary
function getCachedSummary(conversationId, lastMessageTime) {
  const cached = summaryCache.get(conversationId);
  if (!cached) return null;
  
  // Check if cache is still valid
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    summaryCache.delete(conversationId);
    return null;
  }
  
  // Check if there are new messages since the cache was created
  if (lastMessageTime && new Date(lastMessageTime) > new Date(cached.lastMessageTime)) {
    summaryCache.delete(conversationId);
    return null;
  }
  
  return cached.summary;
}

// Set cached summary
function setCachedSummary(conversationId, summary, lastMessageTime) {
  summaryCache.set(conversationId, {
    summary,
    timestamp: Date.now(),
    lastMessageTime
  });
}

// Call OpenAI API
async function callOpenAI(messages, conversationText) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OPENAI_API_KEY not set, using placeholder summary');
    return generatePlaceholderSummary(messages);
  }

  const prompt = `You are a helpful assistant that summarizes chat conversations in Vietnamese.

Given the following conversation between users:
${conversationText}

Please provide:
1. A concise summary in Vietnamese (2-3 paragraphs)
2. Key points in Vietnamese (bullet list, 3-5 items)
3. Action items if any (with @mentions if users are assigned tasks)

IMPORTANT: Respond in Vietnamese language.

Format your response as JSON (no markdown code blocks):
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "actionItems": [
    {"assignee": "@username", "task": "..."}
  ]
}

If there are no clear action items, return an empty array for actionItems.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes chat conversations. Always respond in Vietnamese and return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse JSON response
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanContent);
      return {
        summary: parsed.summary || '',
        keyPoints: parsed.keyPoints || [],
        actionItems: parsed.actionItems || []
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      // Return raw content as summary if JSON parsing fails
      return {
        summary: content,
        keyPoints: [],
        actionItems: []
      };
    }
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

// Generate placeholder summary when OpenAI is not available
function generatePlaceholderSummary(messages) {
  const participants = [...new Set(messages.map(m => m.sender_id?.username).filter(Boolean))];
  const messageCount = messages.length;
  
  // Simple analysis
  const topics = [];
  const messageTexts = messages.map(m => m.content?.toLowerCase() || '').join(' ');
  
  // Detect common topics (Vietnamese keywords)
  if (messageTexts.includes('họp') || messageTexts.includes('meeting')) topics.push('cuộc họp');
  if (messageTexts.includes('project') || messageTexts.includes('dự án')) topics.push('dự án');
  if (messageTexts.includes('deadline') || messageTexts.includes('hạn')) topics.push('deadline');
  if (messageTexts.includes('bug') || messageTexts.includes('lỗi')) topics.push('issues/bugs');
  if (messageTexts.includes('review') || messageTexts.includes('đánh giá')) topics.push('review');
  
  return {
    summary: `Cuộc trò chuyện này có ${messageCount} tin nhắn từ ${participants.length} người tham gia (${participants.join(', ')}). ${topics.length > 0 ? `Các chủ đề được đề cập: ${topics.join(', ')}.` : 'Nội dung bao gồm nhiều chủ đề khác nhau.'}`,
    keyPoints: [
      `${messageCount} tin nhắn tổng cộng`,
      `${participants.length} người tham gia`,
      topics.length > 0 ? `Chủ đề chính: ${topics.join(', ')}` : 'Nhiều chủ đề được thảo luận'
    ],
    actionItems: []
  };
}

// Summarize conversation/thread
router.post('/summarize', authenticate, [
  body('conversation_id').optional().isMongoId().withMessage('Invalid conversation ID'),
  body('thread_id').optional().isMongoId().withMessage('Invalid thread ID'),
  body('type').optional().isIn(['conversation', 'thread']).withMessage('Type must be conversation or thread')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(e => e.msg).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    // Rate limiting
    if (!checkRateLimit(req.user._id.toString())) {
      return res.status(429).json({ 
        error: 'Quá nhiều yêu cầu. Vui lòng đợi 1 phút và thử lại.',
        code: 'RATE_LIMITED'
      });
    }

    const { conversation_id, thread_id, type } = req.body;

    // Require at least one ID
    if (!conversation_id && !thread_id) {
      return res.status(400).json({ error: 'Cần cung cấp conversation_id hoặc thread_id' });
    }

    let messages;
    let conversation;
    
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
      // Check access first
      conversation = await Conversation.findById(conversation_id);
      if (!conversation) {
        return res.status(404).json({ error: 'Cuộc trò chuyện không tồn tại' });
      }
      const isParticipant = conversation?.participants.some(
        p => p.user_id.toString() === req.user._id.toString()
      );
      if (!isParticipant) {
        return res.status(403).json({ error: 'Bạn không có quyền truy cập cuộc trò chuyện này' });
      }

      messages = await Message.find({ conversation_id })
        .populate('sender_id', 'username')
        .sort({ created_at: 1 })
        .limit(500); // Limit to prevent context overflow
    } else if (thread_id) {
      // Thread without explicit type
      messages = await Message.find({
        $or: [
          { _id: thread_id },
          { thread_id: thread_id }
        ]
      })
      .populate('sender_id', 'username')
      .sort({ created_at: 1 });
    } else {
      return res.status(400).json({ error: 'Thiếu thông tin cuộc trò chuyện' });
    }

    // Check message count
    if (messages.length === 0) {
      return res.status(400).json({ 
        error: 'Cuộc trò chuyện không có tin nhắn để tóm tắt.',
        code: 'NO_MESSAGES'
      });
    }

    if (messages.length < 3) {
      return res.status(400).json({ 
        error: 'Cần ít nhất 3 tin nhắn để tạo tóm tắt.',
        code: 'TOO_FEW_MESSAGES'
      });
    }

    // Check cache
    const lastMessage = messages[messages.length - 1];
    const lastMessageTime = lastMessage.created_at;
    const cacheKey = conversation_id || thread_id;
    
    const cachedSummary = getCachedSummary(cacheKey, lastMessageTime);
    if (cachedSummary) {
      console.log('📦 Returning cached summary for:', cacheKey);
      return res.json({
        ...cachedSummary,
        message_count: messages.length,
        cached: true
      });
    }

    // Format messages for AI - filter out sensitive data
    const conversationText = messages
      .map(m => {
        const username = m.sender_id?.username || 'Unknown';
        const content = m.content || '[File/Media]';
        // Filter out potential PII patterns (emails, phone numbers)
        const filteredContent = content
          .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email]')
          .replace(/\b\d{10,}\b/g, '[phone]');
        return `${username}: ${filteredContent}`;
      })
      .join('\n');

    // Call AI
    let summary;
    try {
      summary = await callOpenAI(messages, conversationText);
    } catch (aiError) {
      console.error('AI error, using placeholder:', aiError);
      summary = generatePlaceholderSummary(messages);
    }

    // Cache the result
    setCachedSummary(cacheKey, summary, lastMessageTime);

    res.json({
      ...summary,
      message_count: messages.length,
      cached: false
    });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Không thể tạo tóm tắt. Vui lòng thử lại.' });
  }
});

// Invalidate cache when new message is sent (called from message routes)
export function invalidateSummaryCache(conversationId) {
  if (conversationId) {
    summaryCache.delete(conversationId);
  }
}

export default router;

