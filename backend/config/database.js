import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickping';

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB connected');
    
    if (mongoUri.includes('mongodb+srv://')) {
      console.log('📡 Connected to MongoDB Atlas');
    } else {
      console.log('💻 Connected to local MongoDB');
    }

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    if (mongoUri?.includes('mongodb+srv://')) {
      console.error('💡 For MongoDB Atlas, ensure:');
      console.error('   - IP address is whitelisted in Atlas Network Access');
      console.error('   - Database user credentials are correct');
      console.error('   - Connection string includes database name');
      console.error('   - MONGODB_URI in .env is properly formatted');
    }
    
    process.exit(1);
  }
};

export default connectDB;

