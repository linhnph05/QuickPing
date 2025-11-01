import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  uploader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  original_name: {
    type: String,
    required: true
  },
  stored_name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  mime_type: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  message_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  access_type: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  upload_date: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date
  }
});

fileSchema.index({ uploader_id: 1 });
fileSchema.index({ conversation_id: 1 });

export default mongoose.model('File', fileSchema);

