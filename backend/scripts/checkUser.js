import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const checkUser = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickping';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get email from command line args
    const email = process.argv[2];

    if (!email) {
      console.error('Usage: node scripts/checkUser.js <email>');
      process.exit(1);
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Try exact match
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      // Try case-insensitive
      user = await User.findOne({ 
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } 
      });
    }
    
    if (!user) {
      // List all users
      const allUsers = await User.find({}).select('email username password_hash').limit(10);
      console.log('\n📋 Available users:');
      allUsers.forEach(u => {
        console.log(`  - Email: ${u.email}, Username: ${u.username}, Has Password: ${!!u.password_hash}`);
      });
      console.error(`\n❌ User not found: ${normalizedEmail}`);
      process.exit(1);
    }

    console.log('\n✅ User found:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Has password_hash: ${!!user.password_hash}`);
    console.log(`   Password hash length: ${user.password_hash?.length || 0}`);
    console.log(`   Password hash preview: ${user.password_hash?.substring(0, 20) || 'N/A'}...`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUser();

