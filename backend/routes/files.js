import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import File from '../models/File.js';
import { authenticate } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File size limit: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  // Videos
  'video/mp4', 'video/webm', 'video/quicktime',
  // Audio
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  // Text/Code
  'text/plain',
  'text/csv',
  'application/json',
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Sanitize filename
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, uniqueSuffix + '-' + sanitizedName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE // 5MB limit
  },
  fileFilter
});

const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File quá lớn. Tối đa 5MB',
        code: 'FILE_TOO_LARGE'
      });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Upload single file
router.post('/upload', authenticate, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
}, async (req, res) => {
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

// Upload multiple files
router.post('/upload-multiple', authenticate, (req, res, next) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const { conversation_id, message_id } = req.body;
    const uploadedFiles = [];

    for (const uploadedFile of req.files) {
      const file = new File({
        uploader_id: req.user._id,
        original_name: uploadedFile.originalname,
        stored_name: uploadedFile.filename,
        url: `/uploads/${uploadedFile.filename}`,
        mime_type: uploadedFile.mimetype,
        size: uploadedFile.size,
        conversation_id,
        message_id
      });

      await file.save();
      uploadedFiles.push(file);
    }

    res.status(201).json({ files: uploadedFiles });
  } catch (error) {
    console.error('Upload multiple files error:', error);
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

// Download file
router.get('/:fileId/download', authenticate, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check access (user must be in conversation or be uploader)
    if (file.uploader_id.toString() !== req.user._id.toString()) {
      if (file.conversation_id) {
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

    const filePath = path.join(uploadsDir, file.stored_name);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.original_name)}"`);
    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Length', file.size);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

