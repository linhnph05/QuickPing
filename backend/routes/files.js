import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import File from '../models/File.js';
import { authenticate } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

const router = express.Router();

// Upload file
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { conversation_id, message_id } = req.body;

    const file = new File({
      uploader_id: req.user._id,
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      mime_type: req.file.mimetype,
      size: req.file.size,
      conversation_id,
      message_id
    });

    await file.save();

    res.status(201).json({ file });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get file
router.get('/:fileId', authenticate, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check access (user must be in conversation or be uploader)
    if (file.uploader_id.toString() !== req.user._id.toString()) {
      if (file.conversation_id) {
        // Check if user is in conversation
        const Conversation = (await import('../models/Conversation.js')).default;
        const conversation = await Conversation.findById(file.conversation_id);
        const isParticipant = conversation?.participants.some(
          p => p.user_id.toString() === req.user._id.toString()
        );

        if (!isParticipant) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }
    }

    res.json({ file });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

