import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const fixPasswordHash = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickping';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const email = process.argv[2];
    const plainPassword = process.argv[3];

    if (!email || !plainPassword) {
      console.error('Usage: node scripts/fixPasswordHash.js <email> <plainPassword>');
      console.error('\nThis will hash the plain password with bcrypt and update the user.');
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

    console.log('\n📋 Current user info:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Current password_hash: ${user.password_hash?.substring(0, 30)}...`);
    console.log(`   Hash length: ${user.password_hash?.length || 0}`);

    // Check if password_hash looks like bcrypt (should start with $2a$, $2b$, or $2y$)
    const isBcryptHash = user.password_hash?.match(/^\$2[aby]\$/);
    console.log(`   Is bcrypt hash: ${isBcryptHash ? 'Yes' : 'No'}`);

    // Hash new password
    console.log('\n🔐 Hashing new password...');
    const password_hash = await bcrypt.hash(plainPassword, 10);
    console.log(`   New hash: ${password_hash.substring(0, 30)}...`);

    // Verify the hash works
    const isValid = await bcrypt.compare(plainPassword, password_hash);
    console.log(`   Verification test: ${isValid ? '✅ Pass' : '❌ Fail'}`);

    if (isValid) {
      // Update user
      user.password_hash = password_hash;
      await user.save();
      
      console.log('\n✅ Password updated successfully!');
      console.log(`   Email: ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   New password: ${plainPassword}`);
      console.log('\n💡 You can now login with this password.');
    } else {
      console.error('\n❌ Hash verification failed!');
      process.exit(1);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixPasswordHash();

