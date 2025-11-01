import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const testPassword = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickping';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const email = process.argv[2];
    const testPassword = process.argv[3];

    if (!email) {
      console.error('Usage: node scripts/testPassword.js <email> [testPassword]');
      process.exit(1);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ 
      $or: [
        { email: normalizedEmail },
        { email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } }
      ]
    });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log('\n📋 User Info:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Password hash: ${user.password_hash?.substring(0, 30)}...`);
    console.log(`   Hash length: ${user.password_hash?.length || 0}`);
    
    // Check hash format
    const isBcrypt = user.password_hash?.match(/^\$2[aby]\$/);
    console.log(`   Is bcrypt format: ${isBcrypt ? 'Yes ✅' : 'No ❌'}`);

    if (testPassword) {
      console.log(`\n🔐 Testing password: "${testPassword}"`);
      const isValid = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`   Match result: ${isValid ? '✅ MATCH' : '❌ NO MATCH'}`);
      
      if (!isValid) {
        console.log('\n💡 Password không khớp! Có thể:');
        console.log('   1. Password bạn nhập không đúng');
        console.log('   2. Password hash trong DB không đúng');
        console.log('\n🔧 Để reset password, chạy:');
        console.log(`   npm run fix-password ${email} <new-password>`);
      }
    } else {
      console.log('\n💡 Để test password, chạy:');
      console.log(`   node scripts/testPassword.js ${email} <password-to-test>`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testPassword();

