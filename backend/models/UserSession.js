import mongoose from 'mongoose';

const userSessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expires_at: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

userSessionSchema.index({ user_id: 1 });
userSessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('UserSession', userSessionSchema);

